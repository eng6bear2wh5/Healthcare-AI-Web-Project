// src/api/drugApi.js

// Lấy toàn bộ thuốc
export const getAllDrugs = async () => {
  const res = await fetch("/api/drugs");
  if (!res.ok) throw new Error("Không lấy được danh sách thuốc");
  return await res.json();
};

// Lấy chi tiết thuốc theo ID
export const getDrugById = async (id) => {
  const res = await fetch(`/api/drugs/${id}`);
  if (!res.ok) throw new Error("Không tìm thấy thuốc");
  return await res.json();
};

// Tìm kiếm thuốc (Elasticsearch)
export const searchDrugs = async (q) => {
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error("Tìm kiếm thất bại");
  return await res.json();
};
