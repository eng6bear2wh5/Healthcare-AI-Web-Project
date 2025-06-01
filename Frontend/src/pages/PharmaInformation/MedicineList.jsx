// pages/PharmaInformation/MedicineList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDrugs } from "../../api/drugApi";

const apiURL = import.meta.env.VITE_API_URL;
const API_BASE = import.meta.env.VITE_REACT_APP_API_BASE || "";

function MedicineList() {
  useEffect(() => {
    document.title = "Danh sách thuốc | HealthTrust";
  }, []);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(""); // Thêm state lọc chữ cái
  const [filteredDrugs, setFilteredDrugs] = useState([]);   // Thêm state danh sách đã lọc

  // 1) Load danh sách thuốc từ MongoDB khi component mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const all = await getAllDrugs();
        setDrugs(all);
        setFilteredDrugs(all); // ban đầu hiển thị tất cả
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách thuốc");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // 2) Khi search form submit, gọi Elasticsearch
  const handleSearch = async (e) => {
    e.preventDefault();
    const q = e.target.elements.search.value.trim();
    setQuery(q);
    if (!q) {
      setLoading(true);
      try {
        const all = await getAllDrugs();
        setDrugs(all);
        setFilteredDrugs(all);
      } catch (err) {
        setError("Không thể tải danh sách thuốc");
      } finally {
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Gọi API Elasticsearch
      const res = await fetch(`${API_BASE}/health/search?q=${q}`);
      const results = await res.json();
      setDrugs(results);
      setFilteredDrugs(results);
    } catch (err) {
      setError("Tìm kiếm thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Lọc theo tên và chữ cái
  useEffect(() => {
    let filtered = drugs;
    if (query) {
      filtered = filtered.filter((drug) =>
        drug.name?.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (selectedLetter) {
      filtered = filtered.filter((drug) =>
        drug.name?.toUpperCase().startsWith(selectedLetter)
      );
    }
    setFilteredDrugs(filtered);
  }, [query, selectedLetter, drugs]);

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter === selectedLetter ? "" : letter); // toggle chọn
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Danh sách thuốc</h2>

      {/* Thanh tìm kiếm dùng Elasticsearch */}
      <form onSubmit={handleSearch} className="mb-4 flex">
        <input
          name="search"
          type="text"
          placeholder="Tìm kiếm thuốc..."
          className="border rounded-l px-3 py-2 flex-grow"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Tìm
        </button>
      </form>

      {/* Thanh tìm kiếm dùng gợi ý */}
      {/*
      <div className="mb-4 max-w-md relative">
        <input
          type="text"
          placeholder="Tìm kiếm thuốc..."
          className="border rounded px-3 py-2 w-full"
          value={query}
          onChange={handleInputChange}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={async () => {
              setQuery("");
              setSuggestions([]);
              setLoading(true);
              try {
                const all = await getAllDrugs();
                setDrugs(all);
                setFilteredDrugs(all);
              } catch (err) {
                setError("Không thể tải danh sách thuốc");
              } finally {
                setLoading(false);
              }
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 text-xl font-bold focus:outline-none"
            aria-label="Xóa tìm kiếm"
          >
            ×
          </button>
        )}
        {suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 bg-white border rounded shadow z-10 max-h-60 overflow-y-auto">
            {suggestions.map((drug) => (
              <li
                key={drug._id || drug.id_mongoDB}
                className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleSuggestionClick(drug.name)}
              >
                {drug.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      */}

      {/* A-Z filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <button
          onClick={() => setSelectedLetter("")}
          className={`w-16 h-8 rounded-full font-bold flex items-center justify-center cursor-pointer ${
            selectedLetter === "" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
          } hover:bg-blue-500 hover:text-white transition`}
          aria-label="Tất cả"
          title="Hiện tất cả"
        >
          Tất cả
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`w-8 h-8 rounded-full text-white font-bold cursor-pointer ${
              selectedLetter === letter ? "bg-blue-600" : "bg-gray-400"
            } hover:bg-blue-500 transition`}
          >
            {letter}
          </button>
        ))}
      </div>

      {loading && (
        <div>
          <p className="text-center text-gray-500 mb-2">Đang tải...</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <li key={i} className="border p-4 rounded shadow animate-pulse h-32">
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="text-red-600">Lỗi: {error}</p>}

      {!loading && !error && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredDrugs.map((drug) => (
            <li
              key={drug._id || drug.id_mongoDB}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{drug.name}</h3>
              {drug.indications && (
                <p className="text-gray-600 line-clamp-2">
                  {drug.indications}
                </p>
              )}
              <Link
                to={`/PharmaInformation/MedicineDetail/${
                  drug._id || drug.id_mongoDB
                }`}
                className="text-blue-500 underline"
              >
                Xem chi tiết
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MedicineList;