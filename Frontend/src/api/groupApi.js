// src/api/groupApi.js
const API_BASE = 'http://localhost:5000';

export const getAllGroups = async () => {
  const res = await fetch(`${API_BASE}/api/group_diseases`);
  if (!res.ok) throw new Error("Không lấy được nhóm bệnh");
  return await res.json();
};