// src/pages/Category/DiseaseList.jsx
import React, { useState, useContext, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllDiseases } from "../../api/diseaseApi";
import { CategoryContext } from "../../contexts/CategoryContext";

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
  // const diseases = allDiseases.filter(d => d.group_diseases === categoryId);
  const diseases = allDiseases.filter(
  d => String(d.group_diseases) === categoryId
);

  const filteredDiseases = diseases.filter(d =>
    d.name_diseases.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <p className="text-center text-gray-500">Đang tải danh sách bệnh…</p>
    );
  }
  if (error) {
    return (
      <p className="text-center text-red-600">
        Lỗi khi tải bệnh: {error.message}
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
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

      {filteredDiseases.length === 0 ? (
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
