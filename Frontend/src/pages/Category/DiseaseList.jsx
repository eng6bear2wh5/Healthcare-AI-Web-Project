// src/pages/Category/DiseaseList.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllDiseases } from "../../api/diseaseApi";
import { useContext } from "react";
import { CategoryContext } from "../../contexts/CategoryContext";

export default function DiseaseList() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { categories } = useContext(CategoryContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [diseases, setDiseases] = useState([]);

  // Lấy tên nhóm để hiển thị tiêu đề
  const currentCategory = categories.find(c => c._id === categoryId);

  useEffect(() => {
    getAllDiseases()
      .then(all => {
        // lọc các bệnh thuộc group_diseases === categoryId
        const filtered = all.filter(d => d.group_diseases === categoryId);
        setDiseases(filtered);
      })
      .catch(err => {
        console.error("Lỗi khi tải bệnh:", err);
        setDiseases([]);
      });
  }, [categoryId]);

  const filteredDiseases = diseases.filter(d =>
    d.name_diseases.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
