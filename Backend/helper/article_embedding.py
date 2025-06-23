import json
import os
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.http import models
import logging
import uuid
from dotenv import load_dotenv

load_dotenv('key.env')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- CẤU HÌNH ---
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
# Đặt tên collection mới cho phù hợp
COLLECTION_NAME = "diseases_with_articles_final" 
JSON_FILE = "combined_data.json" # File JSON mới của bạn
MODEL_NAME = 'bkai-foundation-models/vietnamese-bi-encoder'

def setup_collection(qdrant_client, vector_size):
    try:
        qdrant_client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(size=vector_size, distance=models.Distance.COSINE)
        )
        logger.info(f"Đã tạo collection mới: {COLLECTION_NAME}")
        return True
    except Exception as e:
        logger.error(f"Lỗi khi tạo collection: {str(e)}")
        return False

def process_and_upload_data(json_file, model, qdrant_client):
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            documents = json.load(f)
        
        texts_to_embed = []
        payloads = []
        
        for doc in documents:
            disease_name = doc.get("name_diseases")
            description = doc.get("description_disease", "")
            articles = doc.get("articles", []) # Lấy danh sách articles

            if disease_name:
                # 1. DỮ LIỆU ĐỂ EMBEDDING: Vẫn là tên bệnh + mô tả
                combined_text = f"{disease_name}. {description}".strip()
                texts_to_embed.append(combined_text)
                
                # 2. PAYLOAD: Chứa tên bệnh VÀ toàn bộ danh sách articles
                payloads.append({
                    "disease_name": disease_name,
                    "articles": articles  # <-- Thay đổi quan trọng ở đây
                })

        if not texts_to_embed:
            logger.error("Không tìm thấy dữ liệu hợp lệ.")
            return False
        
        logger.info(f"Bắt đầu tạo embeddings cho {len(texts_to_embed)} bệnh...")
        embeddings = model.encode(texts_to_embed, show_progress_bar=True)
        
        logger.info("Bắt đầu tải dữ liệu lên Qdrant...")
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            points=models.Batch(
                ids=[str(uuid.uuid4()) for _ in texts_to_embed],
                vectors=embeddings,
                payloads=payloads
            ),
            wait=True
        )
        
        logger.info(f"Đã tải thành công {len(texts_to_embed)} điểm dữ liệu lên collection '{COLLECTION_NAME}'")
        return True
        
    except Exception as e:
        logger.error(f"Lỗi nghiêm trọng: {e}", exc_info=True)
        return False

def main():
    # Phần main giữ nguyên, chỉ cần đảm bảo các biến cấu hình ở trên là đúng
    if not os.path.exists(JSON_FILE):
        logger.error(f"File '{JSON_FILE}' không tồn tại.")
        return
    
    model = SentenceTransformer(MODEL_NAME, device='cpu')
    vector_size = model.get_sentence_embedding_dimension()
    qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
    
    if setup_collection(qdrant_client, vector_size):
        process_and_upload_data(JSON_FILE, model, qdrant_client)

if __name__ == "__main__":
    main()