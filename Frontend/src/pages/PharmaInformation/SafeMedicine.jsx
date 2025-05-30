import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MedicineList() {
    const [drugs, setDrugs] = useState([]);
    const [filteredDrugs, setFilteredDrugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLetter, setSelectedLetter] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/health/drugs")
            .then((res) => res.json())
            .then((data) => {
                setDrugs(data);
                setFilteredDrugs(data); // ban đầu hiển thị tất cả
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch failed:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let filtered = drugs;

        if (searchTerm) {
            filtered = filtered.filter((drug) =>
                drug.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedLetter) {
            filtered = filtered.filter((drug) =>
                drug.name?.toUpperCase().startsWith(selectedLetter)
            );
        }

        setFilteredDrugs(filtered);
    }, [searchTerm, selectedLetter, drugs]);

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter === selectedLetter ? "" : letter); // toggle chọn
    };

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    if (loading) return <p>Đang tải danh sách thuốc...</p>;

    return (

        <div className="p-4">

            <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:gap-x-4 mb-4">
                <h2 className="text-2xl font-bold text-blue-700 mb-2 md:mb-0 pl-20">Danh sách thuốc</h2>

                <input
                    type="text"
                    placeholder="Tìm tên thuốc..."
                    className="md:w-96 w-full p-2 border rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>



            {/* A-Z filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
                {alphabet.map((letter) => (
                    <button
                        key={letter}
                        onClick={() => handleLetterClick(letter)}
                        className={`w-8 h-8 rounded-full text-white font-bold ${selectedLetter === letter ? "bg-blue-600" : "bg-gray-400"
                            } hover:bg-blue-500 transition`}
                    >
                        {letter}
                    </button>
                ))}
            </div>

            {/* Danh sách thuốc */}
            {filteredDrugs.length === 0 ? (
                <p className="text-gray-500">Không tìm thấy thuốc phù hợp.</p>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredDrugs.map((drug) => (
                        <li
                            key={drug._id}
                            className="border p-4 rounded shadow hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-semibold">{drug.name}</h3>
                            <p className="text-gray-600 line-clamp-2">{drug.indications}</p>
                            <Link
                                to={`/PharmaInformation/MedicineDetail/${drug._id}`}
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
