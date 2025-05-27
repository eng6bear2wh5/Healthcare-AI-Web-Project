// src/pages/Category/CategoryHome.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryContext } from "../../contexts/CategoryContext";

export default function CategoryHome() {
  const { categories } = useContext(CategoryContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filtered = categories.filter(c =>
    c.name_group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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

      {filtered.length === 0 ? (
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
                src={cat.image_url}
                alt={cat.name_group}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-blue-600">
                {cat.name_group}
              </h3>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
