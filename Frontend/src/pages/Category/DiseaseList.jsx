import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllDiseases } from "../../api/diseaseApi";
import { CategoryContext } from "../../contexts/CategoryContext";
import { Helmet } from "react-helmet";

export default function DiseaseList() {
  useEffect(() => {
    document.title = "Chi tiết bệnh | HealthTrust";
  }, []);

  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { categories } = useContext(CategoryContext);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allDiseases = [], isLoading, error } = useQuery({
    queryKey: ["allDiseases", categoryId],
    queryFn: getAllDiseases,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!categoryId,
  });

  const currentCategory = categories.find(c => c._id === categoryId);
  const diseases = allDiseases.filter(
    d => String(d.group_diseases) === categoryId
  );

  const filteredDiseases = diseases.filter(d =>
    (d.name_diseases || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // LCP: Ảnh đầu tiên của danh sách bệnh đã lọc
  const lcpImage = filteredDiseases[0]?.image_url;

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-[1200px]">
      {/* Preload ảnh LCP */}
      <Helmet>
        {lcpImage && (
          <link rel="preload" as="image" href={lcpImage} />
        )}
      </Helmet>

      <h1 className="text-2xl font-bold flex justify-center mb-6 text-blue-700">
        Các bệnh thuộc nhóm: {currentCategory?.name_group || "Không xác định"}
      </h1>

      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Tìm kiếm bệnh theo tên..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Skeleton giữ chỗ khi loading */}
      {isLoading ? (
        <div>
          {/* Skeleton tiêu đề */}
          <div className="h-8 w-2/3 mx-auto bg-gray-200 rounded mb-6 animate-pulse"></div>
          {/* Skeleton thanh tìm kiếm */}
          <div className="mb-6 max-w-md mx-auto">
            <div className="w-full h-12 bg-gray-200 rounded-lg shadow-sm animate-pulse"></div>
          </div>
          {/* Skeleton danh sách bệnh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-[320px] animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <p className="text-center text-red-600">
          Lỗi khi tải bệnh: {error.message}
        </p>
      ) : filteredDiseases.length === 0 ? (
        <p className="text-center text-gray-500">
          Không tìm thấy bệnh nào phù hợp.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map(d => (
            <div
              key={d._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/Category/DiseaseDetail/${d._id}`)}
            >
              <img
                src={d.image_url}
                alt={d.name_diseases}
                className="w-full h-48 object-cover rounded-t-lg"
                width={400}
                height={192}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-blue-600">
                  {d.name_diseases}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}