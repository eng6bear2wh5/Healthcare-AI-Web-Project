// src/contexts/CategoryContext.jsx
import { createContext, useState, useEffect } from "react";
import { getAllGroups } from "../api/groupApi";

export const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllGroups()
      .then(data => setCategories(data))
      .catch(err => console.error("Lỗi khi tải nhóm bệnh:", err));
  }, []);

  return (
    <CategoryContext.Provider value={{ categories }}>
      {children}
    </CategoryContext.Provider>
  );
}
