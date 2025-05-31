// src/components/Articles.jsx
import { useState, useEffect } from "react";

export default function Articles() {
  const [activeTab, setActiveTab] = useState("featured");
  const [articles, setArticles] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [error, setError] = useState(null);

  // 1. Fetch articles + diseases đồng thời
  const API_BASE = 'http://localhost:5000';
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/articles`).then(res => {
        if (!res.ok) throw new Error("Không thể tải bài báo");
        return res.json();
      }),
      fetch(`${API_BASE}/api/diseases`).then(res => {
        if (!res.ok) throw new Error("Không thể tải bệnh");
        return res.json();
      })
    ])
      .then(([arts, dis]) => {
        setArticles(arts);
        setDiseases(dis);
      })
      .catch(err => setError(err.message));
  }, []);

  // 2. Tạo map cho diseases
  const diseaseMap = Object.fromEntries(diseases.map(d => [d._id, d]));

  // 3. Enrich articles với ảnh của disease
  const enriched = articles.map(a => ({
    ...a,
    imageUrl: diseaseMap[a.disease_id]?.image_url || ""
  }));

  // 4. Chọn 7 bài “nổi bật” ngẫu nhiên
  const featured = (() => {
    if (!enriched.length) return [];
    const shuffled = [...enriched].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 7);
  })();

  // 5. Lấy 6 bài “mới nhất”
  const latest = enriched.slice(-6);

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl text-center text-red-600">Lỗi: {error}</h2>
      </section>
    );
  }

  if (!articles.length || !diseases.length) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      </section>
    );
  }

  // 6. Render
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Tabs */}
      <div className="flex gap-6 mb-8 justify-center">
        {["featured","latest"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xl font-semibold pb-2 border-b-2 cursor-pointer ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600"
            } transition`}
          >
            {tab === "featured" ? "Bài viết nổi bật" : "Bài viết mới nhất"}
          </button>
        ))}
      </div>

      {/* Nội dung */}
      {(activeTab === "featured" ? featured : latest).length > 0 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${activeTab==="featured"?4:3} gap-6`}>
          {(activeTab === "featured" ? featured : latest).map((a, i) => (
            <a
              key={a._id || i}
              href={a.article_link}
              target="_blank"
              rel="noopener noreferrer"
              className={`block transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition ${
                activeTab==="featured" && i === 0 ? "lg:col-span-2" : ""
              }`}
            >
              {a.imageUrl && (
                <img
                  src={a.imageUrl}
                  alt={a.article_name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  {a.article_name}
                </h3>
                <button className="text-sm text-blue-500 hover:underline min-h-[48px] min-w-[48px] px-4 py-2 my-2">
                  Đọc thêm →
                </button>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic">
          Không có bài viết {activeTab === "featured" ? "nổi bật" : "mới nhất"}.
        </p>
      )}
    </section>
  );
}
