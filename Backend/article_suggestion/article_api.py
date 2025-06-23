# from flask import Flask, request, jsonify
# from article_extraction import ArticleRecommender
# import logging

# app = Flask(__name__)
# app.json.ensure_ascii = False 


# logging.info("Khởi tạo Recommender...")
# recommender = ArticleRecommender() 
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
from flask_cors import CORS
from article_extraction import ArticleRecommender
import logging

app = Flask(__name__)
app.json.ensure_ascii = False
CORS(app)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

logging.info("Khởi tạo Recommender...")
recommender = ArticleRecommender()
logging.info("Recommender đã sẵn sàng!")

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    if not data or 'disease' not in data:
        return jsonify({"error": "Vui lòng cung cấp 'disease'."}), 400

    background_disease = data.get('disease')
    if not background_disease:
        return jsonify({"recommendations": []})

    logging.info(f"Yêu cầu cho: '{background_disease}'")

    results = recommender.find_recommendations(background_disease, limit=1)

    recommended_articles = []
    if results:
        top_result_payload = results[0].payload
        recommended_articles = top_result_payload.get("articles", [])
    
    logging.info(f"Trả về {len(recommended_articles)} bài báo gợi ý.")
    
    return jsonify({"recommendations": recommended_articles})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)