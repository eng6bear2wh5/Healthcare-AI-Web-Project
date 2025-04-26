import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ChatButton from "../../components/ChatButton";

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
    // Add other medicines here
];

const ITEMS_PER_PAGE = 9;

function SafeMedicine() {
    const [page, setPage] = useState(1);

    useEffect(() => {
        document.title = "Thông tin thuốc an toàn - Health Trust";
    }, []);

    const totalPages = Math.ceil(medicines.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const currentMedicines = medicines.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="max-w-6xl mx-auto p-4 relative">
            <h1 className="text-2xl font-bold mb-4 text-blue-700">Thông tin thuốc an toàn</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentMedicines.map((med, index) => (
                    <Link
                        to={`/PharmaInformation/medicine/${encodeURIComponent(med.name)}`}  // Ensure the path is correct
                        key={index}
                        className="p-4 border rounded shadow hover:shadow-lg transition duration-300 block"
                    >
                        <h2 className="text-lg font-semibold text-blue-600">{med.name}</h2>
                        <p className="text-gray-700">{med.description}</p>
                    </Link>
                ))}
            </div>

            <div className="flex justify-center mt-6 space-x-2">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 rounded border ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <ChatButton />
        </div>
    );
}

export default SafeMedicine;
