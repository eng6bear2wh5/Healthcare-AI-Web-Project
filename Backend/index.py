import json
import os
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.http import models
import logging
import uuid

# Thiết lập logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Cấu hình Qdrant API
QDRANT_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.UrQefZ2qjDg__uH_wT1sSK_N-9P6TisHCso3c1R5fXk"
QDRANT_URL = "https://b364d4b3-530e-4a83-9169-bf8b1e5ae1ab.europe-west3-0.gcp.cloud.qdrant.io"

# Tên collection cho Qdrant
COLLECTION_NAME = "medical_documents_v4"

def setup_collection(qdrant_client, vector_size):
    """Tạo collection mới hoặc xóa collection cũ"""
    try:
        # Kiểm tra collection đã tồn tại chưa
        collections = qdrant_client.get_collections()
        exists = any(collection.name == COLLECTION_NAME for collection in collections.collections)
        
        if exists:
            logger.info(f"Xóa collection {COLLECTION_NAME} cũ")
            qdrant_client.delete_collection(COLLECTION_NAME)
        
        # Tạo collection mới
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(
                size=vector_size,
                distance=models.Distance.COSINE
            )
        )
        logger.info(f"Đã tạo collection {COLLECTION_NAME}")
        return True
        
    except Exception as e:
        logger.error(f"Lỗi khi tạo collection: {str(e)}")
        return False

def process_json_data(json_file, model, qdrant_client):
    """Xử lý file JSON và tải lên Qdrant"""
    try:
        # Đọc file JSON
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        logger.info(f"Đã đọc {len(data)} documents từ file {json_file}")
        
        # Các danh sách để lưu trữ
        texts = []
        metadatas = []
        
        # Xử lý từng document
        for doc in data:
            title = doc.get("title", "")
            url = doc.get("url", "")
            
            # Xử lý từng section
            for section in doc.get("sections", []):
                header = section.get("header", "")
                content = section.get("content", "")
                
                if content:
                    # Format lại văn bản để tìm kiếm tốt hơn
                    text = f"{title}\n\n{header}\n\n{content}"
                    texts.append(text)
                    
                    # Lưu metadata
                    metadatas.append({
                        "title": title,
                        "url": url,
                        "header": header
                    })
        
        # Kiểm tra số lần xuất hiện của từ RSV
        rsv_count = 0
        for text in texts:
            if "RSV" in text or "rsv" in text.lower():
                rsv_count += 1
                # Hiển thị một phần đoạn văn chứa RSV
                idx = text.lower().find("rsv")
                start = max(0, idx - 50)
                end = min(len(text), idx + 50)
                context = text[start:end].replace("RSV", "**RSV**").replace("rsv", "**rsv**")
                logger.info(f"Đoạn văn chứa RSV: ...{context}...")
        
        logger.info(f"Số đoạn văn chứa RSV: {rsv_count}/{len(texts)}")
        
        if not texts:
            logger.error("Không tìm thấy dữ liệu hợp lệ trong file JSON")
            return False
        
        # Tạo embeddings
        logger.info("Tạo embeddings cho văn bản...")
        embeddings = model.encode(texts)
        
        # Upload lên Qdrant
        points = []
        for i, (text, metadata, embedding) in enumerate(zip(texts, metadatas, embeddings)):
            point_id = str(uuid.uuid4())
            
            points.append(
                models.PointStruct(
                    id=point_id,
                    vector=embedding.tolist(),
                    payload={
                        "text": text,
                        **metadata
                    }
                )
            )
        
        # Upload dữ liệu theo batch
        batch_size = 100
        for i in range(0, len(points), batch_size):
            batch = points[i:i+batch_size]
            qdrant_client.upsert(
                collection_name=COLLECTION_NAME,
                points=batch
            )
            logger.info(f"Đã upload batch {i//batch_size + 1}/{(len(points)-1)//batch_size + 1}")
        
        logger.info(f"Đã upload {len(points)} points lên Qdrant")
        return True
        
    except Exception as e:
        logger.error(f"Lỗi khi xử lý file JSON: {str(e)}")
        return False

def main():
    # Đường dẫn đến file JSON
    json_file = "vinmec_articles.json"
    
    # Kiểm tra file tồn tại
    if not os.path.exists(json_file):
        logger.error(f"File {json_file} không tồn tại")
        return
    
    # Khởi tạo mô hình embedding
    logger.info("Khởi tạo mô hình embedding...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    vector_size = model.get_sentence_embedding_dimension()
    logger.info(f"Kích thước vector: {vector_size}")
    
    # Kết nối đến Qdrant
    logger.info(f"Kết nối đến Qdrant tại {QDRANT_URL}")
    qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
    
    # Thiết lập collection
    if not setup_collection(qdrant_client, vector_size):
        logger.error("Không thể thiết lập collection")
        return
    
    # Xử lý dữ liệu
    if not process_json_data(json_file, model, qdrant_client):
        logger.error("Không thể xử lý dữ liệu")
        return
    
    logger.info(f"Hoàn thành quá trình tải dữ liệu lên collection {COLLECTION_NAME}")
    logger.info("Bạn có thể sử dụng file query.py để truy vấn dữ liệu")


if __name__ == "__main__":
    main()