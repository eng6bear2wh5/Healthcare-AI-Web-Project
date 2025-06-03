// src/api/drugApi.js
const API_BASE = 'http://localhost:5000';
// Lấy toàn bộ thuốc
export const getAllDrugs = async () => {
  const res = await fetch(`${API_BASE}/health/drugs`);
  if (!res.ok) throw new Error("Không lấy được danh sách thuốc");
  return await res.json();
};

// Lấy chi tiết thuốc theo ID
export const getDrugById = async (id) => {
  const res = await fetch(`${API_BASE}/health/drugs/${id}`);
  if (!res.ok) throw new Error("Không tìm thấy thuốc");
  return await res.json();
};

// Tìm kiếm thuốc (Elasticsearch)
export const searchDrugs = async (q) => {
  const res = await fetch(`${API_BASE}/health/search?q=${q}`);
  if (!res.ok) throw new Error("Tìm kiếm thất bại");
  return await res.json();
};
