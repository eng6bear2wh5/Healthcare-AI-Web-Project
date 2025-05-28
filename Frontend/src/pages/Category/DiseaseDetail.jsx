import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";

// import CSS scope Quill (đặt cùng folder Category)
import "./QuillContent.css";

export default function DiseaseDetail() {
  const { diseaseId } = useParams();

  const [disease, setDisease] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const resD = await fetch(`/api/diseases/id/${diseaseId}`);
        if (!resD.ok) throw new Error("Không tìm thấy bệnh");
        const diseaseData = await resD.json();
        setDisease(diseaseData);

        const resA = await fetch(`/api/articles/by-disease/${diseaseId}`);
        if (!resA.ok) throw new Error("Không lấy được bài báo");
        setArticles(await resA.json());
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [diseaseId]);

  if (loading)
    return (
      <section className="max-w-4xl mx-auto p-6">
        <p className="text-center text-gray-500">Đang tải...</p>
      </section>
    );
  if (error)
    return (
      <section className="max-w-4xl mx-auto p-6">
        <h2 className="text-center text-red-600">Lỗi: {error}</h2>
      </section>
    );
  if (!disease)
    return (
      <section className="max-w-4xl mx-auto p-6">
        <p className="text-center text-gray-500">Không tìm thấy thông tin.</p>
      </section>
    );

  return (
    <article className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold text-blue-700">
        {disease.name_diseases}
      </h1>

      {/* Ảnh */}
      <img
        src={disease.image_url || "https://via.placeholder.com/600x300"}
        alt={disease.name_diseases}
        className="w-full h-64 object-cover rounded"
      />

      {/* Mô tả bệnh */}
      <section>
        <h1 className="text-2xl font-semibold mb-2 text-blue-700">Mô tả bệnh</h1>
        <div
          className="quill-content"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(disease.description_disease || ""),
          }}
        />
      </section>

      {/* Thông tin chung */}
      <section>
        <h1 className="text-2xl font-semibold mb-2 text-blue-700">Thông tin chung</h1>
        <div
          className="quill-content"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(disease.details || ""),
          }}
        />
      </section>

     
      {/* Bài báo liên quan */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Bài báo liên quan</h2>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((a) => (
              <div
                key={a._id}
                className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                {/* tiêu đề */}
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  {a.article_name}
                </h3>
                
                {/* mô tả tóm tắt */}
                {a.article_description && (
                  <p className="text-gray-700 flex-grow">
                    {a.article_description.length > 100
                      ? a.article_description.slice(0, 100) + "…"
                      : a.article_description}
                  </p>
                )}

                {/* link xem chi tiết */}
                <a
                  href={a.article_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Đọc bài báo
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">
            Không có bài báo liên quan.
          </p>
        )}
      </section>

    </article>
  );
}
