// src/pages/MedicineDetail.jsx
import { useParams } from "react-router-dom";

const medicines = [
    {
        name: "Paracetamol",
        description: "Giảm đau, hạ sốt hiệu quả.",
        image: "https://www.vinmec.com/static/uploads/medium_20190816_113358_772174_paracetamol_max_1800x1800_jpg_d4469bcedb.jpg"
    },
    {
        name: "Amoxicillin",
        description: "Kháng sinh phổ rộng dùng điều trị nhiễm trùng.",
        image: "https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2020/10/thuoc-amoxicillin.jpg"
    },
    {
        name: "Ibuprofen",
        description: "Thuốc chống viêm không steroid.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROgYA6FUOrk24Szlxbm7NPx-zdcxgjZnFzHg&s"
    },
    {
        name: "Cetirizine",
        description: "Giảm triệu chứng dị ứng như hắt hơi, sổ mũi.",
        image: "https://nhathuoclongchau.com.vn/uploads/2022/08/23114424/cetirizin-10mg-domesco-la-thuoc-gi-1.jpg"
    },
    {
        name: "Metformin",
        description: "Điều trị bệnh tiểu đường tuýp 2.",
        image: "https://cdn.tgdd.vn/Files/2021/10/19/1391296/metformin-la-thuoc-gi-cong-dung-va-cach-dung-202110191630206035.jpg"
    },
    {
        name: "Loratadine",
        description: "Giảm ngứa và mẩn đỏ do dị ứng.",
        image: "https://www.haypharma.com/wp-content/uploads/2021/06/Loratadine-1-1.jpg"
    },
    {
        name: "Omeprazole",
        description: "Giảm tiết axit dạ dày, điều trị trào ngược.",
        image: "https://nhathuoclongchau.com.vn/uploads/2023/07/18133458/omeprazol-20mg-tv-pharma-1.jpg"
    },
    {
        name: "Simvastatin",
        description: "Giảm cholesterol trong máu.",
        image: "https://cdn.tgdd.vn/Files/2021/11/08/1396359/simvastatin-la-thuoc-gi-cong-dung-va-cach-dung-202111081553413298.jpg"
    },
    {
        name: "Azithromycin",
        description: "Kháng sinh điều trị nhiễm khuẩn.",
        image: "https://cdn.tgdd.vn/Files/2021/11/08/1396367/azithromycin-la-thuoc-gi-cong-dung-va-cach-dung-202111081602590558.jpg"
    },
    {
        name: "Dextromethorphan",
        description: "Thuốc giảm ho.",
        image: "https://nhathuoclongchau.com.vn/uploads/2021/12/17143137/dextromethorphan-la-thuoc-gi.jpg"
    },
    {
        name: "Ranitidine",
        description: "Giảm tiết axit dạ dày (nay ít dùng do tác dụng phụ).",
        image: "https://thuocbietduoc.com.vn/images/raovat/raovat_151031133716.jpg"
    },
    {
        name: "Diazepam",
        description: "An thần, giảm lo âu.",
        image: "https://cdn.tgdd.vn/Files/2021/11/08/1396360/diazepam-la-thuoc-gi-cong-dung-va-cach-dung-202111081554191991.jpg"
    }
];

function MedicineDetail() {
    const { name } = useParams();
    const medicine = medicines.find(med => med.name === name);

    if (!medicine) {
        return <div className="p-4 text-red-600">Không tìm thấy thông tin thuốc.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-blue-700 mb-4">{medicine.name}</h1>
            {medicine.image && (
                <img src={medicine.image} alt={medicine.name} className="mb-4 rounded shadow-md max-h-64 object-cover" />
            )}
            <p className="text-gray-800 text-lg">{medicine.description}</p>
        </div>
    );
}

export default MedicineDetail;
