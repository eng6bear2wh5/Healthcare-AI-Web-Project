import os
import json
import time
import logging
import threading
from queue import Queue
from concurrent.futures import ThreadPoolExecutor

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException

from bs4 import BeautifulSoup
import lxml  # Faster parser

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler("selenium_scraper.log", encoding='utf-8'), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Import webdriver_manager if available
try:
    from webdriver_manager.chrome import ChromeDriverManager
    WEBDRIVER_MANAGER_AVAILABLE = True
except ImportError:
    WEBDRIVER_MANAGER_AVAILABLE = False
    logger.warning("webdriver_manager not available.")

class BrowserPool:
    def __init__(self, pool_size=5, headless=True):
        self.pool_size = pool_size
        self.headless = headless
        self.browsers = Queue()
        self.lock = threading.Lock()
        self._initialize_pool()
    
    def _create_browser(self):
        options = Options()
        if self.headless:
            options.add_argument("--headless=new")  # Modern headless mode
        
        # Performance optimizations
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--lang=vi-VN")
        options.add_argument("--window-size=1280,720")  # Smaller window size
        options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/111.0.0.0 Safari/537.36")
        options.add_argument("--disable-blink-features=AutomationControlled")
        
        # Critical performance optimizations
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-infobars")
        options.add_argument("--disable-notifications")
        options.add_argument("--blink-settings=imagesEnabled=false")  # Disable image loading
        options.add_argument("--disable-features=site-per-process")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option("useAutomationExtension", False)
        options.page_load_strategy = 'eager'  # Don't wait for non-essential resources
        
        # Create driver
        if WEBDRIVER_MANAGER_AVAILABLE:
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=options)
        else:
            driver = webdriver.Chrome(options=options)
        
        driver.set_page_load_timeout(20)  # Reduced timeout
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        return driver
    
    def _initialize_pool(self):
        for _ in range(self.pool_size):
            self.browsers.put(self._create_browser())
        logger.info(f"Browser pool initialized with {self.pool_size} instances")
    
    def get_browser(self):
        return self.browsers.get()
    
    def return_browser(self, browser):
        self.browsers.put(browser)
    
    def close_all(self):
        with self.lock:
            while not self.browsers.empty():
                browser = self.browsers.get()
                try:
                    browser.quit()
                except Exception as e:
                    logger.error(f"Error closing browser: {str(e)}")
            logger.info("All browsers in the pool have been closed")

class VinmecSeleniumScraper:
    def __init__(self, links_file, output_json, max_workers=5, headless=True):
        self.links_file = links_file
        self.output_json = output_json
        self.max_workers = max_workers
        self.headless = headless
        self.browser_pool = BrowserPool(pool_size=max_workers, headless=headless)
        
        # Filtering configuration
        self.unwanted_headers = ["Hệ thống Vinmec", "Dịch vụ", "Tải App", "Lỗi", "Content not available", 
                                "Theo dõi", "Đối tác", "Tài liệu tham khảo", "Bài viết liên quan", 
                                "Đặt lịch", "Liên hệ", "Chia sẻ", "Share", "Bình luận", "Comment"]
        
        self.unwanted_phrases = ["đặt lịch khám", "TẢI ĐÂY", "HOTLINE", "ứng dụng MyVinmec",
                                "Tải ứng dụng", "MyVinmec", "hotline", "Đặt lịch ngay"]
        
        # Simplified selector strategy
        self.content_selectors = "div.article-content, div.news-content, div.content-detail, div.detail_content, div.article-body, div.main-content, div.content-container"
        self.max_retries = 2  # Reduced retries
        
        # Batch saving
        self.articles = []
        self.save_counter = 0
        self.save_frequency = 50  # Save every 50 successful articles
        self.lock = threading.Lock()
    
    def __del__(self):
        try:
            self.browser_pool.close_all()
        except:
            pass
    
    def read_article_links(self):
        try:
            if not os.path.exists(self.links_file):
                logger.error(f"File not found: {self.links_file}")
                return []
                
            with open(self.links_file, "r", encoding="utf-8") as file:
                links = [line.strip() for line in file.readlines() if line.strip()]
            
            logger.info(f"Loaded {len(links)} article links")
            return links
        except Exception as e:
            logger.error(f"Error reading links file: {str(e)}")
            return []
    
    def handle_language_selection(self, driver):
        try:
            if "Unfortunately, the content on this page is not available in English" in driver.page_source:
                # Directly target language selection buttons
                for selector in ["a:contains('continue')", "a:contains('tiếp tục')", "a.btn-primary", "a:contains('Tiếng Việt')"]:
                    try:
                        elements = driver.find_elements(By.CSS_SELECTOR, selector)
                        for element in elements:
                            if element.is_displayed():
                                element.click()
                                time.sleep(0.5)  # Reduced wait time
                                return True
                    except:
                        continue
                return False
            return True
        except:
            return False
    
    def clean_text(self, text):
        if not text:
            return ""
        return ' '.join(text.split()).replace('\xa0', ' ').replace('\t', ' ').strip()
    
    def is_valid_section(self, header, content):
        if not content or not content.strip():
            return False
        if header and any(unwanted.lower() in header.lower() for unwanted in self.unwanted_headers):
            return False
        if any(phrase in content for phrase in self.unwanted_phrases):
            return False
        if len(content.split()) < 5:
            return False
        return True
    
    def scrape_article(self, url):
        browser = None
        for attempt in range(self.max_retries):
            try:
                browser = self.browser_pool.get_browser()
                
                # Navigate to URL
                logger.info(f"Navigating to {url} (Attempt {attempt+1}/{self.max_retries})")
                browser.get(url)
                
                # Handle language selection
                self.handle_language_selection(browser)
                
                # Wait for title with shorter timeout
                try:
                    WebDriverWait(browser, 5).until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
                except TimeoutException:
                    continue
                
                # Parse with lxml for speed
                soup = BeautifulSoup(browser.page_source, "lxml")
                
                # Extract title
                title_tag = soup.find("h1")
                title = self.clean_text(title_tag.text) if title_tag else "Unknown Title"
                
                if len(title) < 5 or title == "Unknown Title":
                    continue
                
                # Find content container - optimized selector approach
                main_content = soup.select_one(self.content_selectors)
                if not main_content:
                    main_content = soup.find('article') or soup.find('main') or soup.find('body')
                
                # Extract content more efficiently
                content_sections = []
                current_header = "Introduction"
                current_content = []
                
                # Process only the most important tags
                for tag in main_content.find_all(["h2", "h3", "p"]):
                    tag_text = self.clean_text(tag.text)
                    
                    if not tag_text:
                        continue
                        
                    if tag.name in ["h2", "h3"]:
                        # Save previous section
                        if current_content and self.is_valid_section(current_header, " ".join(current_content)):
                            content_sections.append({
                                "header": current_header,
                                "content": " ".join(current_content)
                            })
                        
                        current_header = tag_text
                        current_content = []
                    elif tag.name == "p":
                        current_content.append(tag_text)
                
                # Save the last section
                if current_content and self.is_valid_section(current_header, " ".join(current_content)):
                    content_sections.append({
                        "header": current_header,
                        "content": " ".join(current_content)
                    })
                
                # Fallback for unstructured content
                if not content_sections and title != "Unknown Title":
                    paragraphs = [self.clean_text(p.text) for p in main_content.find_all("p") if self.clean_text(p.text)]
                    if paragraphs:
                        content_sections.append({
                            "header": "Content",
                            "content": " ".join(paragraphs)
                        })
                
                # Return browser to pool
                self.browser_pool.return_browser(browser)
                browser = None
                
                # Create article data
                if content_sections:
                    article_data = {
                        "title": title,
                        "url": url,
                        "sections": content_sections
                    }
                    
                    # Batch saving logic
                    with self.lock:
                        self.articles.append(article_data)
                        self.save_counter += 1
                        if self.save_counter >= self.save_frequency:
                            self.interim_save()
                            self.save_counter = 0
                    
                    logger.info(f"Successfully scraped article: {title}")
                    return article_data
                else:
                    logger.warning(f"No content sections found for {url}")
                    
            except WebDriverException as e:
                logger.error(f"WebDriver error for {url}: {str(e)}")
                
                if browser:
                    try:
                        browser.quit()
                    except:
                        pass
                    browser = self.browser_pool._create_browser()
                    
            except Exception as e:
                logger.error(f"Error processing {url}: {str(e)}")
            
            finally:
                if browser:
                    self.browser_pool.return_browser(browser)
                    browser = None
            
            # Fixed retry delay (no exponential backoff)
            if attempt < self.max_retries - 1:
                time.sleep(1)
        
        return None
    
    def interim_save(self):
        """Save articles gathered so far without stopping the scraper"""
        temp_filename = self.output_json + ".temp"
        try:
            # Read existing articles if the file exists
            existing_articles = []
            if os.path.exists(self.output_json):
                try:
                    with open(self.output_json, "r", encoding="utf-8") as file:
                        existing_articles = json.load(file)
                except:
                    pass
            
            # Combine with new articles
            all_articles = existing_articles + self.articles
            
            # Save to temp file first
            with open(temp_filename, "w", encoding="utf-8") as file:
                json.dump(all_articles, file, ensure_ascii=False, indent=2)
            
            # Rename to actual file
            if os.path.exists(self.output_json):
                os.remove(self.output_json)
            os.rename(temp_filename, self.output_json)
            
            logger.info(f"✅ Interim save: {len(self.articles)} articles to '{self.output_json}'")
            self.articles = []  # Clear current batch
            return True
        except Exception as e:
            logger.error(f"Error during interim save: {str(e)}")
            return False
    
    def save_json(self, additional_articles=None):
        """Final save of all articles"""
        try:
            output_dir = os.path.dirname(self.output_json)
            if output_dir and not os.path.exists(output_dir):
                os.makedirs(output_dir)
            
            all_articles = self.articles.copy()
            if additional_articles:
                all_articles.extend(additional_articles)
                
            # Read existing articles if the file exists
            if os.path.exists(self.output_json):
                try:
                    with open(self.output_json, "r", encoding="utf-8") as file:
                        existing_articles = json.load(file)
                    all_articles.extend(existing_articles)
                except:
                    pass
                
            with open(self.output_json, "w", encoding="utf-8") as file:
                json.dump(all_articles, file, ensure_ascii=False, indent=2)
            logger.info(f"✅ Final save: {len(all_articles)} articles to '{self.output_json}'")
            return True
        except Exception as e:
            logger.error(f"Error saving JSON file: {str(e)}")
            return False
    
    def run(self):
        start_time = time.time()
        logger.info("Starting optimized article extraction")
        
        article_links = self.read_article_links()
        if not article_links:
            logger.error("No article links found. Exiting.")
            return False
        
        total_count = len(article_links)
        success_count = 0
        results = []
        
        try:
            try:
                from tqdm import tqdm
                has_tqdm = True
            except ImportError:
                has_tqdm = False
            
            # Process in parallel with larger thread pool
            with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
                futures = [executor.submit(self.scrape_article, url) for url in article_links]
                
                if has_tqdm:
                    for future in tqdm(futures, total=total_count, desc="Processing Articles"):
                        result = future.result()
                        if result:
                            results.append(result)
                            success_count += 1
                else:
                    for i, future in enumerate(futures):
                        result = future.result()
                        if result:
                            results.append(result)
                            success_count += 1
                        
                        if (i + 1) % 10 == 0 or i + 1 == total_count:
                            percentage = ((i + 1) / total_count) * 100
                            logger.info(f"Progress: {percentage:.1f}% ({success_count}/{i+1} successful)")
            
            # Final save
            self.save_json(results)
            
            # Report
            success_rate = (success_count / total_count) * 100
            elapsed_time = time.time() - start_time
            minutes, seconds = divmod(elapsed_time, 60)
            
            logger.info(f"Completed: {success_count}/{total_count} articles ({success_rate:.1f}%)")
            logger.info(f"Time: {int(minutes)}m {seconds:.2f}s")
            
            return True
                
        except KeyboardInterrupt:
            logger.warning("Process interrupted by user")
            self.save_json(results)
            return False
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            self.save_json(results)
            return False
        finally:
            self.browser_pool.close_all()

def scrape_vinmec_articles(input_file, output_file, max_workers=5, headless=True):
    scraper = VinmecSeleniumScraper(
        links_file=input_file,
        output_json=output_file,
        max_workers=max_workers,
        headless=headless
    )
    
    return scraper.run()

if __name__ == "__main__":
    import sys
    import argparse
    
    parser = argparse.ArgumentParser(description='Optimized Vinmec Scraper')
    parser.add_argument('--input', '-i', default='vinmec_articles.txt', help='Input file with URLs')
    parser.add_argument('--output', '-o', default='vinmec_articles.json', help='Output JSON file')
    parser.add_argument('--workers', '-w', type=int, default=5, help='Number of parallel workers')
    parser.add_argument('--visible', '-v', action='store_true', help='Show browser windows')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.input):
        txt_files = [f for f in os.listdir() if f.endswith('.txt')]
        if txt_files:
            args.input = txt_files[0]
            print(f"Using found text file: {args.input}")
        else:
            print("Error: No suitable input file found.")
            sys.exit(1)
    
    print(f"Starting optimized scraper with {args.workers} workers")
    
    scrape_vinmec_articles(
        input_file=args.input,
        output_file=args.output,
        max_workers=args.workers,
        headless=not args.visible
    )