export default function PromotionsAndEvents() {
    const items = [
        {
            title: "Khuyến mãi kiểm tra sức khỏe tổng quát",
            description: "Giảm 20% khi đặt lịch khám online trong tháng 5!",
            image: "https://via.placeholder.com/150", // Thay bằng ảnh thực tế
        },
        {
            title: "Sự kiện: Hội thảo dinh dưỡng 2025",
            description: "Tham gia hội thảo miễn phí về cách ăn uống khoa học cho cuộc sống khỏe mạnh.",
            image: "https://via.placeholder.com/150",
        },
        {
            title: "Ưu đãi gói khám bệnh chuyên sâu",
            description: "Tặng thêm gói tư vấn bác sĩ miễn phí khi đăng ký gói khám cao cấp.",
            image: "https://via.placeholder.com/150",
        },
        // Thêm nhiều sự kiện hoặc khuyến mãi khác nếu cần
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                Sự kiện & Khuyến mãi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {items.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-5">
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 mb-4">{item.description}</p>
                            <button className="text-sm text-blue-500 hover:underline">
                                Xem chi tiết →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
