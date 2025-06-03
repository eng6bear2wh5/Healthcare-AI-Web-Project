from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
import google.generativeai as genai
import logging
from dotenv import load_dotenv
from pyvi import ViTokenizer, ViPosTagger
import os, json, tempfile
from io import BytesIO
from PIL import Image 
import traceback
import re
from datetime import datetime, timedelta

#--- fix from 1/6/2025
import sys
import codecs
if sys.stdout.encoding != 'utf-8':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    
#--fix from 1/6/2025 

# Load biến môi trường từ file .env
load_dotenv("key.env")

# Thiết lập logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[
                        logging.FileHandler("app.log", encoding='utf-8'),
                        logging.StreamHandler()
                    ])
logger = logging.getLogger(__name__)

# Cấu hình API keys
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Kiểm tra API keys
for key_name, key_value in [
    ("QDRANT_API_KEY", QDRANT_API_KEY), 
    ("QDRANT_URL", QDRANT_URL), 
    ("GEMINI_API_KEY", GEMINI_API_KEY)
]:
    if not key_value:
        logger.error(f"{key_name} is missing")
        raise ValueError(f"{key_name} is missing in environment variables")

# Cấu hình Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Tên collection
COLLECTION_NAME = "medical_documents_v4"

def analyze_image_with_gemini(image_path):
    try:

        
        # Đọc file ảnh với PIL
        image = Image.open(image_path)
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # Khởi tạo model Gemini
        try:
            model = genai.GenerativeModel("models/gemini-2.0-flash")
            logger.info("Using gemini-1.5-flash for image analysis.")
        except Exception:
            model = genai.GenerativeModel("models/gemini-1.5-flash")
        
        # Chuẩn bị prompt
        prompt = """
        NHIỆM VỤ CỦA BẠN: Phân tích ảnh và CHỈ trả về các thuật ngữ y tế thực sự xuất hiện trong ảnh.

        YÊU CẦU NGHIÊM NGẶT:
        1. CHỈ liệt kê các thuật ngữ y tế THỰC SỰ CÓ TRONG ẢNH
        2. KHÔNG BAO GIỜ thêm từ khóa: "hình ảnh", "y tế", "keyword", "phân tích" hay bất kỳ từ meta nào
        3. Nếu nhìn thấy bảng dữ liệu, nhớ bao gồm cả tên thông số (vd: huyết áp) lẫn giá trị (vd: 120/80)
        4. Trả về ngắn gọn, không giải thích, chỉ dùng dấu phẩy phân cách
        5. QUAN TRỌNG: Kiểm tra lại kết quả, đảm bảo chỉ bao gồm từ khóa thực sự xuất hiện trong ảnh

        VÍ DỤ TỐT: huyết áp 120/80, cân nặng 70kg, nhịp tim 75
        VÍ DỤ XẤU: Hình ảnh chứa thông tin y tế về huyết áp và cân nặng
        """
        
        # Thiết lập tham số sinh nội dung
        generation_config = {
            "temperature": 0.1,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 1024,
        }
        
        # Gửi yêu cầu đến Gemini
        try:
            response = model.generate_content(
                contents=[
                    {"role": "user", "parts": [
                        {"text": prompt},
                        {"inline_data": {"mime_type": "image/jpeg", "data": image}}
                    ]}
                ],
                generation_config=generation_config
            )
            
        except Exception:
            # Phương pháp thay thế với base64
            buffered = BytesIO()
            image.save(buffered, format="JPEG")
            img_bytes = buffered.getvalue()
            
            import base64
            encoded_image = base64.b64encode(img_bytes).decode("utf-8")
            
            response = model.generate_content(
                contents=[{
                    "role": "user",
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": "image/jpeg",
                                "data": encoded_image
                            }
                        }
                    ]
                }]
            )
        
        # Xử lý kết quả
        if hasattr(response, 'text'):
            result = response.text.strip()
        elif hasattr(response, 'candidates') and len(response.candidates) > 0:
            result = response.candidates[0].content.parts[0].text.strip()
        else:
            return "Không thể phân tích ảnh"
        
        # Hậu xử lý nhẹ - loại bỏ các từ cấm
        forbidden_terms = ["hình ảnh", "y tế", "keyword", "phân tích", "trích xuất"]
        for term in forbidden_terms:
            result = result.replace(term, "")
        
        # Loại bỏ các ký tự thừa
        result = result.replace("**", "").replace("*", "").strip()
        result = re.sub(r'\s+', ' ', result)  # Chuẩn hóa khoảng trắng

        result = response.text.strip()
        if not result:
            return "Không thể phân tích ảnh (Kết quả trống)"
            
        return result
        
    except Exception as e:
        return f"Không thể phân tích ảnh: {str(e)}"

# Trích keyword y tế bằng pyvi
def extract_medical_keywords(text):
    try:
        words, pos_tags = ViPosTagger.postagging(ViTokenizer.tokenize(text))
        keywords = [w for w, t in zip(words, pos_tags) if t in ['N', 'Np', 'M']]
        return list(set(keywords))
    except Exception as e:
        logger.error(f"Error extracting keywords: {str(e)}")
        return []

def process_image(image_path, user):
    if not user:
        logger.error("process_image called with empty user.")
        return {"error": "User identifier is missing", "info": ""}
    try:
        if not os.path.exists(image_path):
             logger.error(f"Image file not found at path: {image_path}")
             return {"error": "Image file not found", "info": ""}

        # Phân tích ảnh qua Gemini
        medical_info_from_image = analyze_image_with_gemini(image_path) # Giả sử hàm này trả về string hoặc None/Error

        if medical_info_from_image and "Không thể phân tích ảnh" not in medical_info_from_image:
             # Lưu trữ thông tin y tế cho user này
             if save_medical_info(user, f"Thông tin từ ảnh: {medical_info_from_image}"):
                  logger.info(f"Saved image analysis result for user '{user}'.")
             else:
                  logger.error(f"Failed to save image analysis result for user '{user}'.")

             return {
                  "gemini_output": medical_info_from_image,
                  "info": f"Đã phân tích và lưu thông tin từ ảnh cho bạn: {medical_info_from_image}" # Trả về thông báo thân thiện hơn
             }
        elif "Không thể phân tích ảnh" in medical_info_from_image:
             logger.warning(f"Gemini could not analyze image for user '{user}'. Path: {image_path}")
             return {"error": "Không thể phân tích nội dung ảnh.", "info": ""}
        else:
             logger.warning(f"No significant medical info extracted from image for user '{user}'. Path: {image_path}")
             return {"info": "Không tìm thấy thông tin y tế đáng kể trong ảnh."} # Không phải lỗi, chỉ là không có gì để lưu

    except Exception as e:
        logger.error(f"Error processing image for user '{user}': {str(e)}", exc_info=True)
        return {
            "error": f"Xử lý ảnh thất bại: {str(e)}",
            "info": ""
        }
    

USER_DATA_FILE = "user_data.json" # Định nghĩa tên file ở một nơi

def load_all_user_data(filename=USER_DATA_FILE):
    """Tải toàn bộ dữ liệu từ file JSON một cách an toàn."""
    if not os.path.exists(filename):
        logger.info(f"'{filename}' not found. Initializing empty data.")
        return {} # Trả về dict rỗng nếu file không tồn tại
    try:
        # Đọc file với encoding utf-8
        with open(filename, "r", encoding="utf-8") as f:
            # Kiểm tra file có trống không
            content = f.read()
            if not content:
                logger.warning(f"'{filename}' is empty. Initializing empty data.")
                return {}
            # Phân tích JSON từ nội dung đã đọc
            return json.loads(content)
    except json.JSONDecodeError:
        logger.error(f"Error decoding JSON from '{filename}'. Returning empty data.", exc_info=True)
        return {} # Trả về dict rỗng nếu lỗi đọc file hoặc file sai định dạng
    except Exception as e:
        logger.error(f"Unexpected error loading '{filename}': {e}. Returning empty data.", exc_info=True)
        return {}

def save_all_user_data(data, filename=USER_DATA_FILE):
    """Lưu toàn bộ dữ liệu vào file JSON một cách an toàn."""
    try:
        # Ghi file với encoding utf-8
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False) # ensure_ascii=False rất quan trọng cho tiếng Việt
        return True
    except Exception as e:
        logger.error(f"Error saving data to '{filename}': {str(e)}", exc_info=True)
        return False

def _initialize_user_data(all_data, user):
    """Helper: Khởi tạo cấu trúc dữ liệu cho user mới nếu chưa tồn tại."""
    if user not in all_data:
        all_data[user] = {"medical_info": [], "chat_history": []}
        logger.info(f"Initialized data structure for new user: '{user}'")
    else:
        # Đảm bảo các key cần thiết tồn tại (phòng trường hợp cấu trúc cũ/thiếu)
        if "medical_info" not in all_data[user]:
            all_data[user]["medical_info"] = []
        if "chat_history" not in all_data[user]:
            all_data[user]["chat_history"] = []
    return all_data # Trả về dữ liệu đã cập nhật (quan trọng!)


def save_medical_info(user, info, filename=USER_DATA_FILE):
    """Lưu thông tin y tế cho user cụ thể."""
    if not user:
        logger.error("Attempted to save medical info with empty user.")
        return False

    all_data = load_all_user_data(filename)
    all_data = _initialize_user_data(all_data, user) # Đảm bảo user tồn tại

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    all_data[user]["medical_info"].append({
        "timestamp": timestamp,
        "info": info
    })
    logger.info(f"Saved medical info for user '{user}'.")
    return save_all_user_data(all_data, filename)

def get_medical_info(user, filename=USER_DATA_FILE):
    """Lấy danh sách thông tin y tế đã lưu của user."""
    if not user: return []
    all_data = load_all_user_data(filename)
    return all_data.get(user, {}).get("medical_info", [])

def save_chat_message(user, role, content, filename=USER_DATA_FILE):
    """Lưu một tin nhắn vào lịch sử chat của user."""
    if not user:
        logger.error("Attempted to save chat message with empty user.")
        return False

    all_data = load_all_user_data(filename)
    all_data = _initialize_user_data(all_data, user) # Đảm bảo user tồn tại

    all_data[user]["chat_history"].append({
        "role": role, # 'user' hoặc 'assistant'
        "content": content
    })

    # Giới hạn lịch sử chat (ví dụ: 50 tin nhắn cuối) để tránh file quá lớn
    max_history = 50
    if len(all_data[user]["chat_history"]) > max_history:
        all_data[user]["chat_history"] = all_data[user]["chat_history"][-max_history:]
        logger.debug(f"Chat history for user '{user}' truncated to last {max_history} messages.")

    # Không cần log mỗi tin nhắn, trừ khi debug
    # logger.info(f"Saved chat message for user '{user}' (role: {role}).")
    return save_all_user_data(all_data, filename)

def get_chat_history(user, filename=USER_DATA_FILE):
    """Lấy lịch sử chat của user cụ thể."""
    if not user: return []
    all_data = load_all_user_data(filename)
    return all_data.get(user, {}).get("chat_history", [])

def analyze_image(image, user): # Luôn yêu cầu user cụ thể
     """Lưu ảnh tạm, gọi process_image và trả kết quả."""
     if not user:
         logger.error("analyze_image called with empty user.")
         return {"error": "User identifier is missing", "keywords": []} # Giữ cấu trúc trả về cũ nếu cần
     try:
         if image is None: return {"error": "Đối tượng ảnh không hợp lệ", "keywords": []}
         if image.mode != 'RGB': image = image.convert('RGB')

         # Sử dụng with để đảm bảo file tạm được dọn dẹp
         with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
             temp_path = tmp.name
             try:
                 # Lưu với chất lượng cao, xử lý ảnh lớn nếu cần
                 image.save(temp_path, format="JPEG", quality=95)
                 file_size = os.path.getsize(temp_path)
                 if file_size > 10 * 1024 * 1024: # > 10MB
                     max_size = (1600, 1600)
                     image.thumbnail(max_size, Image.LANCZOS)
                     image.save(temp_path, format="JPEG", quality=85)
                     logger.info(f"Resized large image for user '{user}' to fit size limits.")

                 # Gọi quy trình xử lý ảnh với đường dẫn file tạm và user
                 result = process_image(temp_path, user)

             finally:
                 # Đảm bảo xóa file tạm ngay cả khi có lỗi
                 try:
                     os.unlink(temp_path)
                 except Exception as e_unlink:
                     logger.warning(f"Could not delete temp file {temp_path}: {e_unlink}")

         # Trả về kết quả từ process_image
         # Điều chỉnh cấu trúc trả về nếu frontend mong đợi 'keywords'
         if "error" in result:
              return {"error": result["error"], "keywords": []}
         else:
              # Có thể cố gắng trích keywords từ result['info'] nếu cần
              # keywords = extract_medical_keywords(result.get('info', ''))
              return {"answer": result.get('info', 'Xử lý thành công.'), "keywords": []} # Hoặc trả về result trực tiếp

     except Exception as e:
         logger.error(f"Failed to analyze image for user '{user}': {str(e)}", exc_info=True)
         return {
             "error": f"Phân tích ảnh thất bại: {str(e)}",
             "keywords": []
         }

class MedicalQueryBot:
    """Chatbot y tế để truy vấn dữ liệu y khoa"""
    
    def __init__(self):
        # Khởi tạo mô hình embedding
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Kết nối đến Qdrant - QUAN TRỌNG: Thêm timeout để tránh treo
        self.qdrant_client = QdrantClient(
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY,
            timeout=30  # Timeout 30 giây
        )
        
        # Kiểm tra collection tồn tại
        try:
            collection_info = self.qdrant_client.get_collection(COLLECTION_NAME)
            vectors = getattr(collection_info, 'vectors_count', None) or getattr(collection_info, 'points_count', None)
            logger.info(f"Connected to collection with {vectors} vectors")
        except Exception as e:
            raise ValueError(f"Error connecting to collection: {str(e)}")

        
        try:
            self.gemini_model = genai.GenerativeModel('models/gemini-2.5-flash-preview-04-17')
            self.extraction_model = genai.GenerativeModel('models/gemini-2.0-flash-lite') # Hoặc 'models/gemini-2.0-flash'
            
            logger.info("Attempting to initialize primary models: gemini-2.0-flash (main) and gemini-2.0-flash-lite (extraction).")

        except Exception as e_gemini_2_0:
            logger.warning(f"Failed to initialize 2.0 series models: {e_gemini_2_0}. Falling back to 1.5 series.")
            try:
                # Fallback: Sử dụng Gemini 1.5 Flash (ổn định)
                self.gemini_model = genai.GenerativeModel('models/gemini-1.5-flash-latest') # Hoặc 'models/gemini-1.5-flash'
                self.extraction_model = genai.GenerativeModel('models/gemini-1.5-flash-latest') # Hoặc 'models/gemini-1.5-flash'
                logger.info("Successfully initialized fallback models: gemini-1.5-flash-latest (for both main and extraction).")
            except Exception as e_fallback_final:
                logger.error(f"FATAL: Could not initialize any Gemini model after multiple fallbacks: {e_fallback_final}", exc_info=True)
                raise RuntimeError(f"Could not initialize Gemini models: {e_fallback_final}")

    
    
    def answer_question(self, query, limit=5, add_sources=True, debug=False, user="1"):
        """Trả lời câu hỏi y tế dựa trên dữ liệu và lưu thông tin trích xuất"""
        try:
            # BƯỚC 1: LƯU CÂU HỎI HIỆN TẠI CỦA USER (nếu user hợp lệ)
            if user:
                save_chat_message(user, "user", query)
            extracted_info = None
            if user: # Chỉ trích xuất nếu có user để lưu
                 try:
                     extraction_prompt = f"""
                     Hãy trích xuất các thông tin y tế quan trọng từ câu hỏi sau (như triệu chứng, vấn đề sức khỏe, thuốc, điều kiện y tế).
                     CHỈ TRẢ VỀ THÔNG TIN Y TẾ CHÍNH, KHÔNG THÊM BẤT CỨ GIẢI THÍCH HAY NHẬN XÉT NÀO.
                     Định dạng: "Triệu chứng: X, Y, Z" hoặc "Vấn đề: X" hoặc chỉ liệt kê "X, Y, Z"
                     Ví dụ:
                     - Câu hỏi: "Tôi bị đau đầu và sốt 38.5 độ từ hôm qua, nên uống thuốc gì?" -> Kết quả: "đau đầu, sốt 38.5 độ"
                     - Câu hỏi: "Uống paracetamol có tác dụng phụ gì không?" -> Kết quả: "tác dụng phụ paracetamol"

                     Câu hỏi: {query}
                     Thông tin y tế:
                     """
                     extract_response = self.extraction_model.generate_content(extraction_prompt)
                     extracted_info = extract_response.text.strip()

                     if extracted_info:
                         save_medical_info(user, f"Thông tin từ câu hỏi: {extracted_info}")
                         logger.info(f"Extracted and saved info from query for user '{user}': {extracted_info}")
                 except Exception as e_extract:
                     logger.error(f"Error extracting info from query for user '{user}': {str(e_extract)}")
                     # Không cần dừng lại nếu trích xuất lỗi

            
            # BƯỚC 2: XỬ LÝ TÌM KIẾM THÔNG TIN TỪ QDRANT
            # Tạo embedding cho câu hỏi
            query_embedding = self.model.encode(query).tolist()
            
            # Tìm kiếm trong Qdrant
            try:
                search_results = self.qdrant_client.search(
                    collection_name=COLLECTION_NAME,
                    query_vector=query_embedding,
                    limit=limit,
                    with_payload=True
                )
            except Exception as e_qdrant:
                logger.error(f"Qdrant search error for user '{user}': {str(e_qdrant)}")
                return "Xin lỗi, tôi đang gặp sự cố khi tìm kiếm trong cơ sở dữ liệu. Vui lòng thử lại sau."

            context = "\n\n---\n\n".join([
                f"Tiêu đề: {result.payload.get('title', 'N/A')}\n"
                f"Phần: {result.payload.get('header', 'N/A')}\n"
                f"Nội dung: {result.payload.get('text', 'N/A')}"
                for result in search_results
            ]) if search_results else "Không tìm thấy thông tin liên quan trực tiếp trong cơ sở dữ liệu."
            

            
            # BƯỚC 3: LẤY LỊCH SỬ CHAT VÀ THÔNG TIN Y TẾ CỦA USER (nếu user hợp lệ)
            formatted_chat_history = ""
            formatted_medical_info = ""
            if user:
                user_chat_history = get_chat_history(user)
                user_medical_records = get_medical_info(user) # Lấy thông tin y tế đã lưu

                # Chỉ lấy vài tin nhắn gần nhất để không làm prompt quá dài
                recent_chat = user_chat_history[-10:] # Lấy 10 tin nhắn cuối
                formatted_chat_history = "\n".join([f"{msg['role']}: {msg['content']}" for msg in recent_chat])

                if user_medical_records:
                    formatted_medical_info = "THÔNG TIN Y TẾ ĐÃ LƯU CỦA BẠN:\n"
                    recent_records = user_medical_records[-5:] # Lấy 5 bản ghi gần nhất
                    for record in recent_records:
                        timestamp = record.get("timestamp", "")
                        info = record.get("info", "")
                        formatted_medical_info += f"- {timestamp}: {info}\n"
                # Nếu không có thì formatted_medical_info sẽ rỗng
            
            # BƯỚC 4: TẠO PROMPT VÀ GỌI GEMINI ĐỂ TẠO CÂU TRẢ LỜI
            prompt = f"""
            Bạn là một trợ lý y tế giúp trả lời các câu hỏi liên quan đến sức khỏe bằng tiếng Việt.
            LỊCH SỬ TRÒ CHUYỆN GẦN ĐÂY (nếu có):
            {formatted_chat_history}
            {formatted_medical_info}
            CÂU HỎI CỦA NGƯỜI DÙNG: {query}
            
            THÔNG TIN TÌM KIẾM TỪ CƠ SỞ DỮ LIỆU:
            {context}
            
            
            Bạn là trợ lý AI y tế chuyên nghiệp. Khi nhận được câu hỏi y tế, nhiệm vụ của bạn là:

            1. NGHIÊN CỨU CHUYÊN SÂU:
            - Nếu câu hỏi có trong tài liệu được cung cấp sẵn, hãy chỉ duy nhất trả lời dựa trên tài liệu đó.
            - Xem xét "LỊCH SỬ TRÒ CHUYỆN" và "THÔNG TIN Y TẾ ĐÃ LƯU" để hiểu ngữ cảnh và cá nhân hóa câu trả lời nếu phù hợp. Đừng lặp lại thông tin người dùng đã biết trừ khi cần thiết.
            - Đồng thời, hãy tích hợp và phân tích thông tin y tế trước đó của người dùng (nếu có) để cá nhân hóa câu trả lời.
            - Nếu thông tin từ người dùng có liên quan đến câu hỏi hiện tại, hãy đề cập và phân tích mối liên hệ đó.
            - Nếu không đủ thông tin trong tài liệu, hãy tìm kiếm từ các nguồn y tế đáng tin cậy và cập nhật nhất.
            - Chủ động tìm kiếm và trích xuất thông tin mới nhất từ CHÍNH XÁC các nguồn sau đây:
                * Google Scholar
                * Tạp chí Y học Việt Nam (https://tapchiyhocvietnam.vn/)
                * WHO - Tổ chức Y tế Thế giới (https://www.who.int/)
                * CDC - Trung tâm Kiểm soát và Phòng ngừa Dịch bệnh (https://www.cdc.gov/)
                * NIH - Viện Y tế Quốc gia Hoa Kỳ (https://www.nih.gov/)
                * PubMed (https://pubmed.ncbi.nlm.nih.gov/)

            2. TỔNG HỢP THÔNG TIN:
            - Tìm kiếm ít nhất 2-3 nguồn khác nhau để đảm bảo độ tin cậy
            - Ưu tiên các nghiên cứu mới, hướng dẫn chính thức, và đồng thuận y khoa
            - Trích dẫn thông tin từ các bài báo cụ thể, không chỉ từ trang chủ của nguồn

            3. PHONG CÁCH TRẢ LỜI:
            - Viết ngắn gọn, súc tích, dễ hiểu cho người không chuyên y tế
            - Sắp xếp thông tin theo thứ tự: định nghĩa/giải thích > triệu chứng > điều trị/phòng ngừa > thuốc điều trị
            - Giải thích các thuật ngữ y khoa khi cần thiết

            4. TRÍCH DẪN CHÍNH XÁC:
            - Mỗi thông tin quan trọng PHẢI được trích dẫn với định dạng [1], [2], [3]...
            - Mỗi trích dẫn phải là hyperlink có thể nhấn vào, dẫn đến nguồn gốc chính xác
            - Cuối câu trả lời, liệt kê đầy đủ các nguồn tham khảo với định dạng:
                [1] Tên tác giả/tổ chức. (Năm). Tiêu đề. Nguồn xuất bản. URL

            5. LƯU Ý ĐẶC BIỆT:
            - Nếu không tìm thấy thông tin đáng tin cậy, hãy nói rõ: "Tôi không tìm thấy thông tin đáng tin cậy về [chủ đề] từ các nguồn y tế được phép. Tôi khuyên bạn nên tham khảo ý kiến bác sĩ."
            - Luôn kết thúc câu trả lời kèm miễn trừ trách nhiệm: "Thông tin này chỉ mang tính tham khảo, không thay thế cho chẩn đoán hoặc chỉ định của bác sĩ. Hãy tham khảo ý kiến chuyên gia y tế để được tư vấn cụ thể."
            """
            
            # Gọi Gemini API
            try:
                 response = self.gemini_model.generate_content(prompt)
                 # Kiểm tra xem response có text không
                 if hasattr(response, 'text'):
                      bot_answer = response.text
                 elif hasattr(response, 'candidates') and response.candidates:
                      # Lấy text từ candidate đầu tiên nếu có
                      bot_answer = response.candidates[0].content.parts[0].text
                 else:
                      logger.error(f"Gemini response format unexpected for user '{user}'. Response: {response}")
                      bot_answer = "Xin lỗi, tôi không thể tạo câu trả lời vào lúc này."
            except Exception as e_genai:
                 logger.error(f"Gemini generation error for user '{user}': {str(e_genai)}", exc_info=True)
                 # Có thể thử lại với model khác hoặc trả về lỗi
                 bot_answer = "Xin lỗi, tôi gặp sự cố khi tạo câu trả lời. Vui lòng thử lại sau."


            # BƯỚC 5: LƯU CÂU TRẢ LỜI CỦA BOT (nếu user hợp lệ)
            if user:
                save_chat_message(user, "assistant", bot_answer)

            return bot_answer

        except Exception as e:
            logger.error(f"Critical error in answer_question for user '{user}': {str(e)}", exc_info=True)
            return "Xin lỗi, đã xảy ra lỗi nghiêm trọng khi xử lý câu hỏi của bạn."

def main():
    """Hàm chính để chạy chatbot"""
    
    print("\n === Y-Chat: Chatbot Y tế Tiếng Việt ===\n")
    
    try:
        # Khởi tạo chatbot
        chatbot = MedicalQueryBot()
        current_user_id="1"
        
        # Chạy chatbot
        while True:
            query = input("\nNhập câu hỏi của bạn (hoặc 'exit' để thoát): ")
            
            if query.lower() == 'exit':
                break
            
            answer = chatbot.answer_question(query,user=current_user_id)
            print("\nCâu trả lời:")
            print(answer)
            
    except Exception as e:
        print(f"Lỗi: {str(e)}")

# Fix from here 1/6/2025
if __name__ == "__main__":
    import argparse
    import sys
    import json # Already imported but good to note its use here
    from PIL import Image # Ensure PIL.Image is available
    import traceback # Already imported

    # If MedicalQueryBot and other necessary things are defined above, they are in scope.
    # Ensure logging is configured if you want its output when run as a script
    # The existing logging config at the top of your query.py should still work.

    parser = argparse.ArgumentParser(description="Medical Chatbot CLI Interface")
    parser.add_argument("command", choices=["ask", "upload"], help="Command to execute: 'ask' or 'upload'")
    parser.add_argument("--user", type=str, default="cli_guest", help="User ID for context")

    # Arguments for 'ask' command
    parser.add_argument("--question", type=str, help="Question text for the 'ask' command or with 'upload'")

    # Arguments for 'upload' command
    parser.add_argument("--image_path", type=str, help="Path to the image file for the 'upload' command")

    args = parser.parse_args()


    try:
        script_medical_bot = MedicalQueryBot()
    except Exception as e:
        # Print error as JSON to stderr for Node to catch
        print(json.dumps({"error": f"Failed to initialize MedicalQueryBot in CLI: {str(e)}", "trace": traceback.format_exc()}), file=sys.stderr)
        # Print error as JSON to stdout as well, as Node might be primarily listening there
        print(json.dumps({"error": f"Failed to initialize MedicalQueryBot in CLI: {str(e)}"}), file=sys.stdout)
        sys.exit(1)


    cli_result = {}
    try:
        if args.command == "ask":
            if not args.question:
                raise ValueError("Missing --question argument for 'ask' command.")
            # Call the existing answer_question method
            answer = script_medical_bot.answer_question(args.question, user=args.user)
            cli_result = {"answer": answer}

        elif args.command == "upload":
            # This 'upload' command will mimic the logic from your Flask /upload route
            
            # Case 1: Only text question submitted to 'upload' (no image_path provided by Node if not applicable)
            if not args.image_path:
                if args.question:
                    logger.info(f"CLI /upload: No image, processing text question for user '{args.user}'.")
                    answer_from_bot = script_medical_bot.answer_question(args.question, user=args.user)
                    cli_result = {"answer": answer_from_bot}
                else:
                    # This case should ideally be caught by Node.js before calling Python,
                    # but good to have a fallback.
                    cli_result = {"error": "No image file provided and no text question for 'upload' command."}
            else: # Image path is provided
                try:
                    # The analyze_image function in your query.py expects a PIL Image object.
                    pil_image = Image.open(args.image_path)
                except FileNotFoundError:
                    raise ValueError(f"Image file not found at path: {args.image_path}")
                except Exception as e_img:
                    raise ValueError(f"Could not open or process image at {args.image_path}: {str(e_img)}")

                # Call your existing analyze_image function.
                # It saves medical info internally using the user argument.
                image_analysis_response = analyze_image(pil_image, user=args.user)
                # analyze_image returns a dict like {"answer": {"info": ...}} or {"answer": {"error": ...}}

                # Check for errors from image analysis, similar to Flask
                if "answer" in image_analysis_response and \
                   isinstance(image_analysis_response.get("answer"), dict) and \
                   "error" in image_analysis_response.get("answer", {}):
                    logger.error(f"CLI /upload: Error during image analysis for user {args.user}: {image_analysis_response['answer']['error']}")
                    cli_result = image_analysis_response # Forward the error structure
                else:
                    # Image processed, info saved (if any). Now use the bot for a final answer.
                    effective_query = args.question if args.question else "Dựa trên hình ảnh bạn cung cấp, hãy cho tôi biết những thông tin y tế quan trọng và nhận xét (nếu có)."
                    
                    final_answer_from_bot = script_medical_bot.answer_question(
                        query=effective_query, 
                        user=args.user
                    )
                    cli_result = {"answer": final_answer_from_bot}
        
        # Print the final result as JSON to standard output
        print(json.dumps(cli_result, ensure_ascii=False))

    except Exception as e:
        # Log the full error to stderr for debugging on the server
        detailed_error_info = {
            "error": f"Error in query.py CLI: {str(e)}",
            "trace": traceback.format_exc()
        }
        print(json.dumps(detailed_error_info), file=sys.stderr)
        
        # Print a simpler JSON error to stdout, as Node.js will parse this
        print(json.dumps({"error": str(e)}), file=sys.stdout)
        sys.exit(1) # Indicate an error exit status

