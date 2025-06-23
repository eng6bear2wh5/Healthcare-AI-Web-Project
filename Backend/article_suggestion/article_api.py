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
    app.run(host='0.0.0.0', port=5001, debug=True)