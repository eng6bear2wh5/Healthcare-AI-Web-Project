import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { useQuery } from "@tanstack/react-query";
import { getDiseaseById, getArticlesByDisease } from "../../api/diseaseApi";
import { Helmet } from "react-helmet";
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

  // Xác định ảnh LCP
  const lcpImage = disease?.image_url;

   if (ld || la) {
    return (
      <section className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Skeleton ảnh bệnh */}
        <div className="w-full h-[600px] bg-gray-200 rounded mb-8 animate-pulse"></div>
        {/* Skeleton tên bệnh */}
        <div className="h-10 w-2/3 bg-gray-200 rounded mb-6 animate-pulse"></div>
        {/* Skeleton mô tả bệnh */}
        <div>
          <div className="h-6 w-1/3 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-1 animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded mb-1 animate-pulse"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded mb-1 animate-pulse"></div>
        </div>
        {/* Skeleton thông tin chung */}
        <div>
          <div className="h-6 w-1/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-1 animate-pulse"></div>
          <div className="h-4 w-4/6 bg-gray-200 rounded mb-1 animate-pulse"></div>
          <div className="h-4 w-3/5 bg-gray-200 rounded mb-1 animate-pulse"></div>
        </div>
        {/* Skeleton bài báo liên quan */}
        <div>
          <div className="h-6 w-1/3 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col gap-2 animate-pulse">
                <div className="h-6 w-2/3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
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
      {/* Preload ảnh LCP */}
      <Helmet>
        {lcpImage && (
          <link rel="preload" as="image" href={lcpImage} />
        )}
      </Helmet>

      <h1 className="text-3xl font-bold text-blue-700">
        {disease.name_diseases}
      </h1>

      <img
        src={disease.image_url}
        srcSet={
          disease.image_url
            ? `${disease.image_url}?w=600 600w, ${disease.image_url}?w=1200 1200w, ${disease.image_url}?w=1800 1800w`
            : undefined
        }
        sizes="(max-width: 640px) 100vw, 1200px"
        alt={disease.name_diseases}
        className="w-full h-[600px] object-cover rounded"
        width={1200}
        height={600}
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