# from flask import Flask, request, jsonify
# from query2 import ArticleRecommender
# import logging

# app = Flask(__name__)
# app.json.ensure_ascii = False # Hiển thị tiếng Việt đẹp

# # --- THAY ĐỔI COLLECTION NAME TRONG FILE QUERY.PY CỦA BẠN ---
# # Hãy mở file query.py và đổi COLLECTION_NAME thành "diseases_with_articles"
# # -------------------------------------------------------------

# logging.info("Khởi tạo Recommender...")
# recommender = ArticleRecommender() # Giả sử query.py đã được cập nhật
# logging.info("Recommender đã sẵn sàng!")

# @app.route('/recommend', methods=['POST'])
# def get_recommendations():
#     data = request.get_json()
#     if not data or 'disease' not in data:
#         return jsonify({"error": "Vui lòng cung cấp 'disease'."}), 400

#     background_disease = data['disease']
#     logging.info(f"Yêu cầu cho: '{background_disease}'")

#     # Tìm kiếm chỉ 1 kết quả phù hợp nhất (bệnh liên quan nhất)
#     results = recommender.find_recommendations(background_disease, limit=1)

#     article_names = []
#     if results:
#         # Lấy payload của kết quả đầu tiên và duy nhất
#         top_result_payload = results[0].payload
        
#         # Trích xuất danh sách articles từ payload
#         articles_in_payload = top_result_payload.get("articles", [])
        
#         # Lặp qua danh sách và chỉ lấy ra 'article_name'
#         for article in articles_in_payload:
#             article_names.append(article.get("article_name"))
    
#     logging.info(f"Trả về {len(article_names)} tên bài báo.")
    
#     # Trả về một danh sách các 'article_name'
#     return jsonify(article_names)

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from query2 import ArticleRecommender
import logging

app = Flask(__name__)
app.json.ensure_ascii = False # Hiển thị tiếng Việt đẹp

# Kích hoạt CORS cho ứng dụng Flask
# Điều này cho phép React app (chạy ở domain khác) có thể gọi API này
CORS(app) 

# --- CẤU HÌNH LOGGING ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

logging.info("Khởi tạo Recommender...")
try:
    recommender = ArticleRecommender()
    logging.info("Recommender đã sẵn sàng!")
except Exception as e:
    logging.error(f"Không thể khởi tạo Recommender: {e}")
    recommender = None # Đặt recommender thành None nếu có lỗi

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    if not recommender:
        return jsonify({"error": "Dịch vụ gợi ý hiện không khả dụng."}), 503

    data = request.get_json()
    if not data or 'disease' not in data:
        return jsonify({"error": "Vui lòng cung cấp 'disease' trong body của request."}), 400

    background_disease = data.get('disease')
    if not background_disease:
        # Nếu bệnh nền là rỗng hoặc null, trả về danh sách rỗng thay vì lỗi
        logging.info("Yêu cầu với bệnh nền rỗng. Trả về danh sách trống.")
        return jsonify({"recommendations": []})

    logging.info(f"Yêu cầu gợi ý cho bệnh nền: '{background_disease}'")

    # Tìm kiếm chỉ 1 kết quả phù hợp nhất (bệnh liên quan nhất)
    results = recommender.find_recommendations(background_disease, limit=1)

    recommended_articles = []
    if results:
        # Lấy payload của kết quả đầu tiên và duy nhất
        top_result_payload = results[0].payload
        
        # Trích xuất toàn bộ danh sách articles từ payload.
        # Danh sách này đã chứa các object đầy đủ { article_name, article_link, ... }
        recommended_articles = top_result_payload.get("articles", [])
        
    logging.info(f"Trả về {len(recommended_articles)} bài báo gợi ý.")
    
    # Trả về một object JSON với key "recommendations"
    # Giá trị của key này là một danh sách các object bài báo đầy đủ
    return jsonify({"recommendations": recommended_articles})

if __name__ == '__main__':
    # Chạy trên host 0.0.0.0 để có thể truy cập từ máy khác trong cùng mạng
    app.run(host='0.0.0.0', port=5000, debug=True)