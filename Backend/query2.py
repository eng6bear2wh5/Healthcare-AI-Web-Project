import os
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
import logging
from dotenv import load_dotenv

# Tải các biến môi trường từ file key.env
load_dotenv('key.env')

# Thiết lập logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- CẤU HÌNH ---
# !!! QUAN TRỌNG: Các giá trị này PHẢI GIỐNG HỆT file embedding của bạn.
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
# Collection name phải khớp với collection đã tạo ở file embedding
COLLECTION_NAME = "diseases_with_articles" 
# Model phải là model đã dùng để tạo embeddings
MODEL_NAME = 'bkai-foundation-models/vietnamese-bi-encoder'

class ArticleRecommender:
    def __init__(self):
        """Khởi tạo Recommender, tải mô hình và kết nối Qdrant."""
        logger.info(f"Đang tải mô hình embedding: {MODEL_NAME}...")
        # Sử dụng 'cpu' hoặc 'cuda' nếu có GPU
        self.model = SentenceTransformer(MODEL_NAME, device='cpu')
        logger.info("Mô hình đã được tải.")

        logger.info(f"Kết nối đến Qdrant tại {QDRANT_URL}...")
        self.qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
        logger.info("Kết nối Qdrant thành công.")

    def find_recommendations(self, background_disease: str, limit: int = 5):
        """
        Tìm các bài báo/bệnh liên quan dựa trên bệnh nền của người dùng.

        Args:
            background_disease (str): Chuỗi bệnh nền (ví dụ: "đau dạ dày").
            limit (int): Số lượng kết quả tối đa muốn nhận về.

        Returns:
            list: Danh sách các kết quả tìm được.
        """
        try:
            # 1. Embedding chuỗi truy vấn (bệnh nền) tại thời điểm thực thi
            logger.info(f"Đang tạo embedding cho truy vấn: '{background_disease}'")
            query_embedding = self.model.encode(background_disease)

            # 2. Tìm kiếm trong Qdrant
            logger.info(f"Đang tìm kiếm {limit} kết quả liên quan nhất...")
            search_results = self.qdrant_client.search(
                collection_name=COLLECTION_NAME,
                query_vector=query_embedding,
                limit=limit,
                with_payload=True  # Yêu cầu Qdrant trả về payload (chứa title)
            )
            
            logger.info("Tìm kiếm hoàn tất.")
            return search_results

        except Exception as e:
            logger.error(f"Đã xảy ra lỗi trong quá trình tìm kiếm: {e}")
            return []

# --- CÁCH SỬ DỤNG ---
if __name__ == "__main__":
    # Khởi tạo recommender (trong ứng dụng web, bạn chỉ cần làm việc này một lần)
    recommender = ArticleRecommender()

    # Giả lập thông tin bệnh nền lấy từ personal tracker của bệnh nhân
    benh_nen_benh_nhan = "triệu chứng của bệnh đau dạ dày"
    
    # Tìm kiếm đề xuất
    results = recommender.find_recommendations(benh_nen_benh_nhan, limit=3)

    # In kết quả
    if results:
        print("\n---")
        print(f"✅ Đề xuất cho bệnh nền '{benh_nen_benh_nhan}':")
        for i, result in enumerate(results):
            # Payload chứa thông tin bạn đã lưu ở file embedding
            title = result.payload.get('title')
            score = result.score
            print(f"  {i+1}. {title} (Độ tương đồng: {score:.4f})")
        print("---\n")
    else:
        print("\nKhông tìm thấy kết quả phù hợp.\n")