import os
import json
import time
import random
import logging
import threading
from datetime import datetime
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor
from queue import Queue

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException

from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("selenium_scraper.log", encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Try to import the webdriver_manager for easier ChromeDriver management
try:
    from webdriver_manager.chrome import ChromeDriverManager
    WEBDRIVER_MANAGER_AVAILABLE = True
except ImportError:
    WEBDRIVER_MANAGER_AVAILABLE = False
    logger.warning("webdriver_manager not available. Please ensure ChromeDriver is installed manually.")

class BrowserPool:
    """Manages a pool of browser instances for parallel scraping"""
    
    def __init__(self, pool_size=3, headless=True):
        self.pool_size = pool_size
        self.headless = headless
        self.browsers = Queue()
        self.lock = threading.Lock()
        
        # Initialize the browser pool
        self._initialize_pool()
    
    def _create_browser(self):
        """Create a new browser instance with appropriate settings"""
        options = Options()
        
        if self.headless:
            options.add_argument("--headless")
        
        # Common settings to make the browser more stable and avoid detection
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--lang=vi-VN")
        options.add_argument("--window-size=1920,1080")
        
        # Set a realistic user agent
        options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36")
        
        # Disable automation flags and notifications
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option("useAutomationExtension", False)
        options.add_argument("--disable-notifications")
        
        # Initialize the WebDriver
        if WEBDRIVER_MANAGER_AVAILABLE:
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=options)
        else:
            driver = webdriver.Chrome(options=options)
        
        # Set page load timeout
        driver.set_page_load_timeout(30)
        
        # Additional settings
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        return driver
    
    def _initialize_pool(self):
        """Create the initial pool of browsers"""
        for _ in range(self.pool_size):
            browser = self._create_browser()
            self.browsers.put(browser)
        logger.info(f"Browser pool initialized with {self.pool_size} instances")
    
    def get_browser(self):
        """Get a browser from the pool, waiting if necessary"""
        return self.browsers.get()
    
    def return_browser(self, browser):
        """Return a browser to the pool"""
        self.browsers.put(browser)
    
    def close_all(self):
        """Close all browser instances"""
        with self.lock:
            while not self.browsers.empty():
                browser = self.browsers.get()
                try:
                    browser.quit()
                except Exception as e:
                    logger.error(f"Error closing browser: {str(e)}")
            logger.info("All browsers in the pool have been closed")

class VinmecSeleniumScraper:
    """Selenium-based scraper for Vinmec articles"""
    
    def __init__(self, links_file, output_json, max_workers=3, headless=True):
        self.links_file = links_file
        self.output_json = output_json
        self.max_workers = max_workers
        self.headless = headless
        
        # Initialize browser pool
        self.browser_pool = BrowserPool(pool_size=max_workers, headless=headless)
        
        # Configuration for unwanted content
        self.unwanted_headers = [
            "Hệ thống Vinmec", "Dịch vụ", "Tải App MyVinmec", "Lỗi", 
            "Content not available", "Theo dõi chúng tôi", "Đối tác liên kết", 
            "Tài liệu tham khảo", "Bài viết liên quan", "Đặt lịch", "Liên hệ",
            "Chia sẻ", "Share", "Bình luận", "Comment"
        ]
        
        self.unwanted_phrases = [
            "đặt lịch khám", "TẢI ĐÂY", "HOTLINE", "ứng dụng MyVinmec",
            "Tải ứng dụng", "MyVinmec", "hotline", "Đặt lịch ngay"
        ]
        
        # Content container selectors
        self.content_selectors = [
            "div.article-content", 
            "div.news-content", 
            "div.content-detail",
            "div.detail_content", 
            "div.article-body", 
            "div.main-content",
            "div.content-container"
        ]
        
        # Maximum retry attempts per URL
        self.max_retries = 3
    
    def __del__(self):
        """Ensure browser resources are cleaned up"""
        try:
            self.browser_pool.close_all()
        except:
            pass
    
    def read_article_links(self):
        """Read article links from a text file"""
        try:
            if not os.path.exists(self.links_file):
                logger.error(f"File not found: {self.links_file}")
                print(f"Error: Input file '{self.links_file}' not found.")
                print(f"Current working directory: {os.getcwd()}")
                print("Available files in this directory:")
                for file in os.listdir():
                    print(f"  - {file}")
                return []
                
            with open(self.links_file, "r", encoding="utf-8") as file:
                links = [line.strip() for line in file.readlines() if line.strip()]
            
            logger.info(f"Loaded {len(links)} article links from {self.links_file}")
            return links
        except Exception as e:
            logger.error(f"Error reading links file: {str(e)}")
            return []
    
    def handle_language_selection(self, driver, url):
        """Handle language selection pages by clicking the continue button"""
        try:
            # Check if we're on a language selection page
            if "Unfortunately, the content on this page is not available in English" in driver.page_source:
                logger.info(f"Detected language selection page for {url}")
                
                # Try clicking "continue" buttons with different strategies
                strategies = [
                    # Try buttons with certain text content
                    lambda: driver.find_elements(By.XPATH, "//a[contains(text(), 'continue') or contains(text(), 'tiếp tục')]"),
                    
                    # Try buttons with specific CSS classes
                    lambda: driver.find_elements(By.CSS_SELECTOR, "a.btn, a.btn-primary, .btn-continue"),
                    
                    # Try elements containing Vietnamese text
                    lambda: driver.find_elements(By.XPATH, "//a[contains(text(), 'Tiếng Việt') or contains(text(), 'Vietnamese')]"),
                    
                    # Try all anchor elements as a last resort
                    lambda: driver.find_elements(By.TAG_NAME, "a")
                ]
                
                for strategy in strategies:
                    buttons = strategy()
                    for button in buttons:
                        # Skip hidden buttons
                        if not button.is_displayed():
                            continue
                            
                        # Get the button text for logging
                        button_text = button.text.strip()
                        if not button_text:
                            # If no text, get the inner HTML
                            button_text = button.get_attribute("innerHTML")
                            
                        logger.info(f"Attempting to click: {button_text[:30]}...")
                        
                        try:
                            # Try to click the button
                            button.click()
                            
                            # Wait a moment for the page to load
                            time.sleep(2)
                            
                            # Check if we're no longer on the language page
                            if "Unfortunately, the content on this page is not available in English" not in driver.page_source:
                                logger.info(f"Successfully navigated past language selection")
                                return True
                        except Exception as e:
                            logger.warning(f"Failed to click element: {str(e)}")
                    
                logger.warning(f"Could not find a clickable language selection button")
                return False
            return True  # No language selection page detected
        except Exception as e:
            logger.error(f"Error handling language selection: {str(e)}")
            return False
    
    def clean_text(self, text):
        """Clean and normalize text content"""
        if not text:
            return ""
            
        # Replace multiple whitespace with a single space
        cleaned = ' '.join(text.split())
        # Remove unwanted characters
        cleaned = cleaned.replace('\xa0', ' ').replace('\t', ' ').strip()
        return cleaned
    
    def is_valid_section(self, header, content):
        """Filter out unwanted sections based on headers and content"""
        if not content or not content.strip():
            return False
            
        if header and any(unwanted.lower() in header.lower() for unwanted in self.unwanted_headers):
            return False
            
        if any(phrase in content for phrase in self.unwanted_phrases):
            return False
            
        # Check for very short sections that are likely not meaningful content
        if len(content.split()) < 5:
            return False
            
        return True
    
    def extract_metadata(self, soup, url):
        """Extract metadata from the article"""
        metadata = {
            "author": "Unknown",
            "published_date": "Unknown",
            "category": "Unknown",
            "domain": urlparse(url).netloc,
            "scrape_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Extract author
        author_selectors = ["span.author", ".news-author", ".article-author", ".author-name"]
        for selector in author_selectors:
            author_elem = soup.select_one(selector)
            if author_elem and author_elem.text.strip():
                metadata["author"] = self.clean_text(author_elem.text)
                break
        
        # Extract date
        date_selectors = ["span.date", ".news-date", "time", ".article-date", ".published-date"]
        for selector in date_selectors:
            date_elem = soup.select_one(selector)
            if date_elem and date_elem.text.strip():
                metadata["published_date"] = self.clean_text(date_elem.text)
                break
        
        # Extract category
        category_selectors = [".breadcrumb a", ".category-tag", ".article-category", ".category"]
        for selector in category_selectors:
            category_elems = soup.select(selector)
            if category_elems and len(category_elems) > 0:
                # Take the last breadcrumb item as the most specific category
                metadata["category"] = self.clean_text(category_elems[-1].text)
                break
        
        return metadata
    
    def find_content_container(self, soup):
        """Find the main content container"""
        for selector in self.content_selectors:
            container = soup.select_one(selector)
            if container:
                return container
                
        # Fallback to article or main tags
        for tag_name in ['article', 'main', 'div.body', 'section.content']:
            container = soup.select_one(tag_name)
            if container:
                return container
                
        # Last resort - use the whole body
        return soup.find('body') or soup
    
    def scrape_article(self, url):
        """Scrape a single article with retry logic"""
        browser = None
        
        for attempt in range(self.max_retries):
            try:
                # Get a browser from the pool
                browser = self.browser_pool.get_browser()
                
                # Add random delay between requests
                time.sleep(random.uniform(1, 3))
                
                # Navigate to the URL
                logger.info(f"Navigating to {url} (Attempt {attempt+1}/{self.max_retries})")
                browser.get(url)
                
                # Handle potential language selection pages
                if not self.handle_language_selection(browser, url):
                    logger.warning(f"Could not handle language selection for {url}")
                    continue  # Try again
                
                # Wait for the main content to load
                try:
                    WebDriverWait(browser, 10).until(
                        EC.presence_of_element_located((By.TAG_NAME, "h1"))
                    )
                except TimeoutException:
                    logger.warning(f"Timed out waiting for content to load on {url}")
                    continue  # Try again
                
                # Get the fully rendered page source
                page_source = browser.page_source
                
                # Parse with BeautifulSoup
                soup = BeautifulSoup(page_source, "html.parser")
                
                # Extract title
                title_tag = soup.find("h1")
                title = self.clean_text(title_tag.text) if title_tag else "Unknown Title"
                
                # Skip if title is very short or generic
                if len(title) < 5 or title == "Unknown Title":
                    logger.warning(f"Invalid or missing title for {url}")
                    continue  # Try again
                
                # Extract metadata
                metadata = self.extract_metadata(soup, url)
                
                # Find the main content container
                main_content = self.find_content_container(soup)
                
                # Extract content sections
                content_sections = []
                current_header = "Introduction"  # Default header for initial content
                current_content = []
                
                # Process section headers and their content
                for tag in main_content.find_all(["h2", "h3", "h4", "p", "ul", "ol"]):
                    tag_text = self.clean_text(tag.text)
                    
                    if not tag_text:
                        continue  # Skip empty elements
                        
                    if tag.name in ["h2", "h3", "h4"]:
                        # Save previous section if it's valid
                        if current_content and self.is_valid_section(current_header, " ".join(current_content)):
                            content_sections.append({
                                "header": current_header, 
                                "content": " ".join(current_content)
                            })
                        
                        current_header = tag_text
                        current_content = []
                    elif tag.name == "p":
                        if tag_text:  # Skip empty paragraphs
                            current_content.append(tag_text)
                    elif tag.name in ["ul", "ol"]:
                        # Process list items
                        list_items = [self.clean_text(li.text) for li in tag.find_all("li") if self.clean_text(li.text)]
                        list_text = ". ".join(list_items)
                        if list_text:
                            current_content.append(list_text)
                
                # Save the last section if valid
                if current_content and self.is_valid_section(current_header, " ".join(current_content)):
                    content_sections.append({
                        "header": current_header, 
                        "content": " ".join(current_content)
                    })
                
                # If we have no content sections but we have a title, try a simpler extraction approach
                if not content_sections and title != "Unknown Title":
                    logger.warning(f"No structured content found for {url}, using simplified extraction")
                    
                    # Extract all paragraphs from the main content
                    all_paragraphs = [self.clean_text(p.text) for p in main_content.find_all("p") if self.clean_text(p.text)]
                    
                    if all_paragraphs:
                        combined_content = " ".join(all_paragraphs)
                        content_sections.append({
                            "header": "Content",
                            "content": combined_content
                        })
                
                # Return the browser to the pool
                self.browser_pool.return_browser(browser)
                browser = None
                
                # Create the article object
                article_data = {
                    "title": title,
                    "url": url,
                    "metadata": metadata,
                    "sections": content_sections
                }
                
                # Validate that we have actual content
                if content_sections:
                    logger.info(f"Successfully scraped article: {title}")
                    return article_data
                else:
                    logger.warning(f"No content sections found for {url}")
                    
            except WebDriverException as e:
                logger.error(f"WebDriver error for {url}: {str(e)}")
                
                # Handle crashed browser by creating a new one
                if browser:
                    try:
                        browser.quit()
                    except:
                        pass
                    
                    # Create a new browser instance for the pool
                    browser = self.browser_pool._create_browser()
                    
            except Exception as e:
                logger.error(f"Error processing {url}: {str(e)}")
            
            finally:
                # Always return the browser to the pool if it exists
                if browser:
                    self.browser_pool.return_browser(browser)
                    browser = None
            
            # Add increasing delay between retries
            retry_delay = (2 ** attempt) + random.uniform(0, 2)
            logger.info(f"Retrying in {retry_delay:.2f} seconds...")
            time.sleep(retry_delay)
        
        logger.error(f"Failed to scrape {url} after {self.max_retries} attempts")
        return None
    
    def save_json(self, articles):
        """Save articles to JSON file"""
        try:
            # Create intermediate directories if needed
            output_dir = os.path.dirname(self.output_json)
            if output_dir and not os.path.exists(output_dir):
                os.makedirs(output_dir)
                
            with open(self.output_json, "w", encoding="utf-8") as file:
                json.dump(articles, file, ensure_ascii=False, indent=4)
            logger.info(f"✅ Successfully saved {len(articles)} articles to '{self.output_json}'")
            return True
        except Exception as e:
            logger.error(f"Error saving JSON file: {str(e)}")
            return False
    
    def process_article(self, url):
        """Process a single article (for parallel execution)"""
        return self.scrape_article(url)
    
    def run(self):
        """Run the scraper to extract articles and save as JSON"""
        start_time = time.time()
        logger.info(f"Starting article extraction process with Selenium")
        
        # Read article links
        article_links = self.read_article_links()
        if not article_links:
            logger.error("No article links found. Exiting.")
            return False
        
        # Process articles
        articles = []
        
        # Process the articles
        total_count = len(article_links)
        success_count = 0
        
        try:
            # Check if tqdm is available for better progress display
            try:
                from tqdm import tqdm
                has_tqdm = True
            except ImportError:
                has_tqdm = False
            
            # Process articles sequentially using the browser pool for parallelism
            with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
                futures = [executor.submit(self.process_article, url) for url in article_links]
                
                # Process results with progress tracking
                if has_tqdm:
                    for future in tqdm(futures, total=total_count, desc="Processing Articles"):
                        result = future.result()
                        if result:
                            articles.append(result)
                            success_count += 1
                else:
                    for i, future in enumerate(futures):
                        result = future.result()
                        if result:
                            articles.append(result)
                            success_count += 1
                        
                        # Show progress periodically
                        if (i + 1) % 5 == 0 or i + 1 == total_count:
                            percentage = ((i + 1) / total_count) * 100
                            logger.info(f"Progress: {percentage:.1f}% complete ({success_count}/{i+1} successful)")
            
            # Save results to JSON
            if articles:
                self.save_json(articles)
                
                # Generate a summary report
                success_rate = (success_count / total_count) * 100
                logger.info(f"Summary Report:")
                logger.info(f"- Total links processed: {total_count}")
                logger.info(f"- Successfully scraped: {success_count} ({success_rate:.1f}%)")
                logger.info(f"- Failed to scrape: {total_count - success_count}")
                
                elapsed_time = time.time() - start_time
                minutes, seconds = divmod(elapsed_time, 60)
                hours, minutes = divmod(minutes, 60)
                logger.info(f"Process completed in {int(hours)}h {int(minutes)}m {seconds:.2f}s")
                
                return True
            else:
                logger.error("No articles were successfully scraped")
                return False
                
        except KeyboardInterrupt:
            logger.warning("Process interrupted by user")
            
            # Save any articles we've collected so far
            if articles:
                self.save_json(articles)
                logger.info(f"Saved {len(articles)} articles before interruption")
            
            return False
        except Exception as e:
            logger.error(f"Unexpected error during article processing: {str(e)}")
            
            # Try to save any articles we've collected so far
            if articles:
                self.save_json(articles)
                logger.info(f"Saved {len(articles)} articles despite error")
            
            return False
        finally:
            # Clean up browser resources
            self.browser_pool.close_all()

def scrape_vinmec_articles(input_file, output_file, max_workers=3, headless=True):
    """Main function to scrape Vinmec articles using Selenium"""
    # Create and run the scraper
    scraper = VinmecSeleniumScraper(
        links_file=input_file,
        output_json=output_file,
        max_workers=max_workers,
        headless=headless
    )
    
    return scraper.run()

if __name__ == "__main__":
    # Check for command line arguments
    import sys
    import argparse
    
    parser = argparse.ArgumentParser(description='Scrape Vinmec articles using Selenium')
    parser.add_argument('--input', '-i', default='vinmec_articles.txt', help='Input file containing article URLs')
    parser.add_argument('--output', '-o', default='vinmec_selenium_articles.json', help='Output JSON file')
    parser.add_argument('--workers', '-w', type=int, default=3, help='Number of parallel workers')
    parser.add_argument('--visible', '-v', action='store_true', help='Show browser windows (non-headless mode)')
    
    args = parser.parse_args()
    
    # Check if input file exists
    if not os.path.exists(args.input):
        # Look for any .txt files
        txt_files = [f for f in os.listdir() if f.endswith('.txt')]
        if txt_files:
            args.input = txt_files[0]
            print(f"Using found text file: {args.input}")
        else:
            print("Error: No suitable input file found.")
            sys.exit(1)
    
    print(f"Starting Selenium scraper with settings:")
    print(f"- Input file: {args.input}")
    print(f"- Output file: {args.output}")
    print(f"- Workers: {args.workers}")
    print(f"- Browser visibility: {'Visible' if args.visible else 'Headless'}")
    print("To cancel, press Ctrl+C at any time.")
    
    scrape_vinmec_articles(
        input_file=args.input,
        output_file=args.output,
        max_workers=args.workers,
        headless=not args.visible
    )