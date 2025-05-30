// src/pages/Category/DiseaseDetail.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { useQuery } from "@tanstack/react-query";
import { getDiseaseById, getArticlesByDisease } from "../../api/diseaseApi";
import "./QuillContent.css";

export default function DiseaseDetail() {
  useEffect(() => {
      document.title = "Thông tin về bệnh | HealthTrust";
  }, []);

  const { diseaseId } = useParams();
  const { data: disease, isLoading: ld, error: errD } = useQuery({
    queryKey: ["disease", diseaseId],
    queryFn: () => getDiseaseById(diseaseId),
    staleTime: 0,
  });

  const { data: articles = [], isLoading: la, error: errA } = useQuery({
    queryKey: ["articles", diseaseId],
    queryFn: () => getArticlesByDisease(diseaseId),
    enabled: !!diseaseId,
    staleTime: 0,
  });


  // Sửa phần kiểm tra loading và error cho đúng tên biến
  if (ld || la) {
    return (
      <section className="max-w-4xl mx-auto p-6">
        <p className="text-center text-gray-500">Đang tải...</p>
      </section>
    );
  }

  const err = errD || errA;
  if (err) {
    return (
      <section className="max-w-4xl mx-auto p-6">
        <h2 className="text-center text-red-600">Lỗi: {err.message}</h2>
      </section>
    );
  }

  if (!disease) {
    return (
      <section className="max-w-4xl mx-auto p-6">
        <p className="text-center text-gray-500">Không tìm thấy thông tin.</p>
      </section>
    );
  }

  return (
    <article className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-blue-700">
        {disease.name_diseases}
      </h1>

      <img
        src={disease.image_url || "https://via.placeholder.com/600x300"}
        alt={disease.name_diseases}
        className="w-full h-120 object-cover rounded"
      />

      <section>
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">
          Mô tả bệnh
        </h2>
        <div
          className="quill-content"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(disease.description_disease || ""),
          }}
        />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">
          Thông tin chung
        </h2>
        <div
          className="quill-content"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(disease.details || ""),
          }}
        />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Bài báo liên quan
        </h2>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map(a => (
              <div
                key={a._id}
                className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  {a.article_name}
                </h3>
                {a.article_description && (
                  <p className="text-gray-700 flex-grow">
                    {a.article_description.length > 100
                      ? a.article_description.slice(0, 100) + "…"
                      : a.article_description}
                  </p>
                )}
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