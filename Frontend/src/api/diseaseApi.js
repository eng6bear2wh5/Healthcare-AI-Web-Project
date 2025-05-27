// src/api/diseaseApi.js

export const getAllDiseases = async () => {
  const res = await fetch("/api/diseases");
  if (!res.ok) throw new Error("Không lấy được danh sách bệnh");
  return await res.json();
};

// Lấy chi tiết bệnh theo ID
export const getDiseaseById = async (id) => {
  const res = await fetch(`/api/diseases/id/${id}`);
  if (!res.ok) throw new Error("Không tìm thấy bệnh");
  return await res.json();
};

// Lấy các bài báo theo disease_id
export const getArticlesByDisease = async (diseaseId) => {
  const res = await fetch(`/api/articles/by-disease/${diseaseId}`);
  if (!res.ok) throw new Error("Không lấy được bài báo");
  return await res.json();
};

