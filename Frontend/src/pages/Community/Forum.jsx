import { useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
// Giữ nguyên ChatButton nếu bạn muốn thêm chức năng chat

// Dữ liệu diễn đàn tĩnh
const forums = [
    {
        id: 1,
        title: "Diễn đàn sức khỏe 2025",
        description: "Chia sẻ kiến thức về chăm sóc sức khỏe và sức khỏe cộng đồng.",
    },
    {
        id: 2,
        title: "Hội thảo dinh dưỡng hiện đại",
        description: "Chia sẻ về dinh dưỡng hiện đại và các chủ đề dinh dưỡng phổ biến.",
    },
    {
        id: 3,
        title: "Diễn đàn về sức khỏe người cao tuổi",
        description: "Chia sẻ kinh nghiệm và kiến thức về chăm sóc sức khỏe người cao tuổi.",
    },
];

export default function Forum() {
    useEffect(() => {
        document.title = "Diễn đàn sức khỏe - Health Trust";
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4 relative">
            <h1 className="text-2xl font-bold mb-6 text-blue-700">Diễn đàn sức khỏe</h1>
            <div className="space-y-4">
                {forums.map((forum) => (
                    <div key={forum.id} className="border p-4 rounded shadow hover:shadow-md transition duration-300">
                        <h2 className="text-xl font-semibold text-blue-600">{forum.title}</h2>
                        <p className="text-gray-700">{forum.description}</p>
                        <Link to={`/Community/Forum/${forum.id}`}>
                            <button className="text-blue-600 hover:text-blue-800 mt-2">Tham gia diễn đàn</button>
                        </Link>
                    </div>
                ))}
            </div>
            <ChatButton /> {/* Giữ ChatButton nếu bạn muốn người dùng có thể chat ngay từ trang diễn đàn */}
        </div>
    );
}
