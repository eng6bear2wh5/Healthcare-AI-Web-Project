// src/contexts/CategoryContext.jsx
import { createContext, useState, useEffect } from "react";

export const CategoryContext = createContext();

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch("/api/group_Diseases")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Lỗi khi tải nhóm bệnh:", err));
    }, []);

    return (
        <CategoryContext.Provider value={{ categories }}>
            {children}
        </CategoryContext.Provider>
    );
}
