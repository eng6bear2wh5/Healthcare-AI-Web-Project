// pages/PharmaInformation/MedicineList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDrugs, searchDrugs } from "../../api/drugApi";

function MedicineList() {
  useEffect(() => {
    document.title = "Danh sách thuốc | HealthTrust";
  }, []);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // 1) Load danh sách thuốc từ MongoDB khi component mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const all = await getAllDrugs();
        setDrugs(all);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách thuốc");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  //Khi nào dùng ElasticSearch thì dùng cái này
  // // 2) Khi search form submit, gọi Elasticsearch
  // const handleSearch = async (e) => {
  //   e.preventDefault();
  //   const q = e.target.elements.search.value.trim();
  //   setQuery(q);
  //   if (!q) {
  //     // nếu bỏ trống, load lại toàn bộ
  //     setLoading(true);
  //     try {
  //       const all = await getAllDrugs();
  //       setDrugs(all);
  //     } catch (err) {
  //       console.error(err);
  //       setError("Không thể tải danh sách thuốc");
  //     } finally {
  //       setLoading(false);
  //     }
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const results = await searchDrugs(q);
  //     setDrugs(results);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Tìm kiếm thất bại");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //Khi dùng ElasticSearch thì xóa cái này đi
  // Gợi ý tên thuốc khi người dùng gõ
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (!value) {
      setSuggestions([]);
      return;
    }
    // Lọc danh sách thuốc theo tên
    const filtered = drugs.filter((drug) =>
      drug.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 8)); // chỉ gợi ý tối đa 8 thuốc
  };

  // Khi chọn gợi ý
  const handleSuggestionClick = (name) => {
    setQuery(name);
    setSuggestions([]);
    // Lọc danh sách thuốc chỉ còn thuốc được chọn
    setDrugs(drugs.filter((drug) => drug.name === name));
  };

return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Danh sách thuốc</h2>

      {/* Thanh tìm kiếm chỉ dùng ES */}
      {/* <form onSubmit={handleSearch} className="mb-4 flex">
        <input
            name="search"
            type="text"
            placeholder="Tìm kiếm thuốc bằng Elasticsearch..."
            className="border rounded-l px-3 py-2 flex-grow"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            Tìm
          </button>
        </form> */}

      {/* Thanh tìm kiếm gợi ý */}
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
          {drugs.map((drug) => (
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
  