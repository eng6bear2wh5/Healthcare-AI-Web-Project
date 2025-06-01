// src/pages/Category/CategoryHome.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryContext } from "../../contexts/CategoryContext";
import { useQueryClient } from '@tanstack/react-query';
import { Helmet } from "react-helmet";

export default function CategoryHome() {
  useEffect(() => {
    document.title = "Chuyên mục bệnh | HealthTrust";
  }, []);

  const queryClient = useQueryClient();
  const { categories } = useContext(CategoryContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filtered = categories.filter(c =>
    c.name_group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Preload ảnh LCP nếu có */}
      <Helmet>
        {categories[0] && (
          <link rel="preload" as="image" href={categories[0].image_url} />
        )}
      </Helmet>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl flex justify-center font-bold text-blue-600 mb-6">
          Chuyên mục bệnh
        </h2>

        <div className="mb-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Tìm kiếm nhóm bệnh..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Skeleton giữ chỗ khi chưa có dữ liệu */}
        {categories.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md p-5 animate-pulse h-[272px]">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            Không tìm thấy nhóm bệnh phù hợp.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(cat => (
              <div
                key={cat._id}
                className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/Category/DiseaseList/${cat._id}`)}
              >
              <img
                src={cat.image_url + "?w=400"}
                srcSet={`${cat.image_url}?w=400 400w, ${cat.image_url}?w=800 800w`}
                sizes="(max-width: 640px) 100vw, 400px"
                alt={cat.name_group}
                className="w-full h-48 object-cover rounded-lg mb-4"
                width={400}
                height={192}
              />
                <h3 className="text-xl font-semibold text-blue-600">
                  {cat.name_group}
                </h3>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}