import { useEffect } from "react";
//import ChatButton from "../../components/ChatButton";

const events = [
    {
        title: "Ngày hội Sức khỏe 2025",
        date: "2025-05-15",
        description: "Sự kiện nâng cao nhận thức về chăm sóc sức khỏe cộng đồng với nhiều hoạt động bổ ích.",
        image: "https://tl.cdnchinhphu.vn/344445545208135680/2025/3/10/thumb-kh70-1741336002348394593866-17413360035291469422584-17415782298851636302283.jpg" // Thêm URL hình ảnh
    },
    {
        title: "Hội thảo Dinh dưỡng hiện đại",
        date: "2025-06-10",
        description: "Hội thảo chuyên đề về các xu hướng dinh dưỡng và lời khuyên từ chuyên gia.",
        image: "https://honutas.com/wp-content/uploads/2024/07/2T7A0536-scaled.jpg" // Thêm URL hình ảnh
    },
    {
        title: "Khám sức khỏe miễn phí cho người cao tuổi",
        date: "2025-07-01",
        description: "Chương trình thiện nguyện khám bệnh và phát thuốc miễn phí dành cho người lớn tuổi.",
        image: "https://cdn-images.vtv.vn/thumb_w/640/562122370168008704/2023/8/30/ksk-mien-phi-16933928696472126693528.jpg" // Thêm URL hình ảnh
    },
];

export default function Event() {
    useEffect(() => {
        document.title = "Sự kiện sắp tới - Health Trust";
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4 relative">
            <h1 className="text-2xl font-bold mb-6 text-blue-700">Sự kiện sắp tới</h1>
            <div className="space-y-4">
                {events.map((event, index) => (
                    <div key={index} className="border p-4 rounded shadow hover:shadow-md transition duration-300">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-48 object-cover rounded mb-4" // Thêm class để căn chỉnh hình ảnh
                        />
                        <h2 className="text-xl font-semibold text-blue-600">{event.title}</h2>
                        <p className="text-sm text-gray-500 mb-2">{event.date}</p>
                        <p className="text-gray-700">{event.description}</p>
                    </div>
                ))}
            </div>
            <ChatButton />
        </div>
    );
}
