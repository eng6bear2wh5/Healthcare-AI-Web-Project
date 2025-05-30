import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function MedicineDetail() {
    const { id } = useParams();
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/health/drugs/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setMedicine(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching detail:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Đang tải chi tiết thuốc...</div>;
    if (!medicine) return <div className="text-red-600">Không tìm thấy thông tin thuốc.</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
            <h1 className="text-3xl font-bold text-blue-700 mb-4">{medicine.name}</h1>

            {[
                ["Chỉ định", medicine.indications],
                ["Chống chỉ định", medicine.contraindications],
                ["Thận trọng", medicine.precautions],
                ["Tác dụng phụ", medicine.side_effects],
                ["Liều dùng & Cách dùng", medicine.dosage_and_administration],
                ["Ghi chú sử dụng", medicine.usage_notes],
                ["Tài liệu tham khảo", medicine.references]
            ].map(([label, value]) => (
                value && (
                    <div className="mb-4" key={label}>
                        <h2 className="text-xl font-semibold text-gray-800">{label}</h2>
                        <p className="text-gray-700">{value}</p>
                    </div>
                )
            ))}
        </div>
    );
}

export default MedicineDetail;
