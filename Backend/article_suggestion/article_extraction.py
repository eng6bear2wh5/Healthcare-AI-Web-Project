import os
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from dotenv import load_dotenv
import logging

load_dotenv('../.env')

class ArticleRecommender:
    def __init__(self):
        self.model = SentenceTransformer(
            'bkai-foundation-models/vietnamese-bi-encoder', 
            device='cpu'
        )
        qdrant_url = os.getenv("QDRANT_URL")
        qdrant_api_key = os.getenv("QDRANT_API_KEY")
        
        if not qdrant_url or not qdrant_api_key:
            raise ValueError("QDRANT_URL và QDRANT_API_KEY phải được thiết lập trong key.env")
            
        self.qdrant_client = QdrantClient(
            url=qdrant_url, 
            api_key=qdrant_api_key
        )
        self.collection_name = "diseases_with_articles_final"

    def find_recommendations(self, disease_query: str, limit: int = 3):
        """
        Tìm kiếm các bệnh liên quan và trả về danh sách các ScoredPoint thô từ Qdrant.
        """
        try:
            logging.info(f"Đang tạo vector cho truy vấn: '{disease_query}'")
            query_vector = self.model.encode(disease_query).tolist()

            logging.info(f"Đang tìm kiếm trong collection '{self.collection_name}'...")
            search_results = self.qdrant_client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=limit,
                with_payload=True # Đảm bảo lấy payload
            )
            logging.info("Tìm kiếm hoàn tất.")
            
            # --- PHẦN IN LOG ĐÃ SỬA LẠI ---
            # Phần này chỉ để hiển thị trong console, không ảnh hưởng đến kết quả API
            print(f"\n✅ Kết quả tìm kiếm cho bệnh nền '{disease_query}':")
            for hit in search_results:
                disease_name = hit.payload.get("disease_name", "Không rõ tên bệnh")
                articles = hit.payload.get("articles", [])
                print(f"--- Bệnh phù hợp: '{disease_name}' (Độ tương đồng: {hit.score:.4f}) ---")
                if articles:
                    print(f"  Gồm {len(articles)} bài báo:")
                    for i, article in enumerate(articles):
                        print(f"    {i+1}. {article.get('article_name')}")
                else:
                    print("  Không có bài báo nào trong payload.")
                print("-" * 20)

            return search_results
        
        except Exception as e:
            logging.error(f"Lỗi trong quá trình tìm kiếm: {e}", exc_info=True)
            return []