// src/api/groupApi.js

export const getAllGroups = async () => {
  const res = await fetch("/api/group_diseases");
  if (!res.ok) throw new Error("Không lấy được nhóm bệnh");
  return await res.json();
};