// Articles.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const ArticleCard = ({ article }) => (
  <a
    href={article.article_link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col h-full transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg"
  >
    {article.imageUrl ? (
      <img
        src={article.imageUrl}
        alt={article.article_name}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Không có ảnh</span>
      </div>
    )}
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-lg font-semibold text-blue-600 mb-2 flex-grow">
        {article.article_name}
      </h3>
      <span className="inline-block text-sm text-blue-500 hover:underline mt-2 self-start">
        Đọc thêm →
      </span>
    </div>
  </a>
);

const DynamicArticleGrid = ({ articles }) => {
  const count = articles.length;

  if (count === 1) {
    return (
      <div className="flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <ArticleCard article={articles[0]} />
        </div>
      </div>
    );
  }

  if (count === 2 || count === 4) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {articles.map((article) => (
          <ArticleCard key={article._id || article.article_name} article={article} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article._id || article.article_name} article={article} />
      ))}
    </div>
  );
};

export default function Articles() {
  const { user } = useAuth();
  
  // Khởi tạo state cho tab.
  const [activeTab, setActiveTab] = useState('latest'); 
  
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [error, setError] = useState(null);
  const [latestArticles, setLatestArticles] = useState([]);
  const [suggestedArticles, setSuggestedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [diseaseMap, setDiseaseMap] = useState({});

  // Tải dữ liệu chính (bệnh và bài mới nhất)
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch("/api/diseases").then((res) => { if (!res.ok) throw new Error("Không thể tải danh sách bệnh"); return res.json(); }),
      fetch("/api/articles/latest-distinct").then((res) => { if (!res.ok) throw new Error("Không thể tải bài báo mới nhất"); return res.json(); }),
    ])
    .then(([diseasesData, latestDistinctData]) => {
      const newDiseaseMap = Object.fromEntries(diseasesData.map((d) => [d._id, d]));
      setDiseaseMap(newDiseaseMap);
      const enrich = (a) => ({ ...a, imageUrl: newDiseaseMap[a.disease_id]?.image_url || "" });
      setLatestArticles(latestDistinctData.map(enrich));
    })
    .catch((err) => setError(err.message))
    .finally(() => setIsLoading(false));
  }, []);

  // Tải bài báo gợi ý khi có user
  useEffect(() => {
    if (user && Object.keys(diseaseMap).length > 0) {
      fetch("/api/medical-history/me", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setMedicalHistory(data?.disease_name || null);
          return fetch("http://127.0.0.1:5000/recommend", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ disease: data?.disease_name || "" }),
          });
        })
        .then((res) => res.json())
        .then((data) => {
          const recommendations = data.recommendations || [];
          const enriched = recommendations.map(a => ({ ...a, imageUrl: diseaseMap[a.disease_id]?.image_url || "" }));
          setSuggestedArticles(enriched);
        })
        .catch((err) => console.error("Lỗi khi lấy gợi ý:", err.message));
    } else {
      setSuggestedArticles([]);
    }
  }, [user, diseaseMap]);

  useEffect(() => {
    // Effect này chỉ chạy khi người dùng ĐĂNG NHẬP hoặc ĐĂNG XUẤT.
    if (user) {
      // Khi người dùng đăng nhập, tự động chuyển họ sang tab gợi ý.
      setActiveTab('suggested');
    } else {
      // Khi người dùng đăng xuất, chuyển họ về tab mới nhất.
      setActiveTab('latest');
    }
  }, [user]); // Chỉ phụ thuộc vào `user`!

  if (isLoading) {
    return <section className="max-w-7xl mx-auto px-4 py-10"><p className="text-center text-gray-500 text-xl">Đang tải dữ liệu...</p></section>;
  }

  if (error) {
    return <section className="max-w-7xl mx-auto px-4 py-10"><h2 className="text-2xl text-center text-red-600">Lỗi: {error}</h2></section>;
  }


  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {user && activeTab === 'suggested' && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600">
            {medicalHistory ? `Dựa trên bệnh nền "${medicalHistory}", đây là các bài báo dành cho bạn:` : "Bạn chưa cập nhật bệnh nền để nhận gợi ý."}
          </h2>
        </div>
      )}

      <div className="flex gap-6 mb-8 justify-center">
        <button onClick={() => setActiveTab("suggested")} className={`text-xl font-semibold pb-2 border-b-2 cursor-pointer transition-all ${activeTab === "suggested" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-600"}`}>
          Bài báo liên quan
        </button>
        <button onClick={() => setActiveTab("latest")} className={`text-xl font-semibold pb-2 border-b-2 cursor-pointer transition-all ${activeTab === "latest" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-600"}`}>
          Bài báo mới nhất
        </button>
      </div>

      <div className="mt-8">
        {activeTab === 'latest' && (
          latestArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <ArticleCard key={article._id || article.article_name} article={article} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 italic">Không có bài viết mới nhất nào.</p>
          )
        )}

        {activeTab === 'suggested' && (
          !user ? (
            <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-blue-800">Bạn cần đăng nhập để xem gợi ý.</h3>
              <p className="text-gray-600 mt-2">Đăng nhập để nhận các bài viết phù hợp với hồ sơ sức khỏe của bạn.</p>
              <Link to="/login" className="mt-4 inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                  Đăng nhập ngay
              </Link>
            </div>
          ) : (
            suggestedArticles.length > 0 ? (
              <DynamicArticleGrid articles={suggestedArticles} />
            ) : (
              <div className="flex justify-center items-center text-center">
                <p className="text-gray-500 italic">
                  Không tìm thấy bài viết nào phù hợp với bệnh nền của bạn. Hãy đến phần <Link to="Community/News" className="text-blue-600 hover:underline">tin tức</Link> để xem các tin tức khác nhé.
                </p>
              </div>
            )
          )
        )}
      </div>
    </section>
  );
}