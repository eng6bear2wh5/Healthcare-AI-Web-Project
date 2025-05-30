import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MedicineList() {
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/health/drugs") // hoặc /health/drugs nếu dùng proxy Vite
            .then((res) => res.json())
            .then((data) => {
                setDrugs(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch failed:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Đang tải danh sách thuốc...</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Danh sách thuốc</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {drugs.map((drug) => (
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
        </div>
    );

}

export default MedicineList;
