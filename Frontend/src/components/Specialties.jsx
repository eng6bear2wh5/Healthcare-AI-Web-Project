import { FaHeartbeat, FaLungs, FaBrain, FaBone, FaSpa, FaUserMd } from "react-icons/fa"; // Icon đẹp từ react-icons

export default function Specialties() {
    const specialties = [
        {
            icon: <FaHeartbeat className="text-red-500 text-4xl mb-4" />,
            title: "Tim mạch",
            description: "Chăm sóc và điều trị các bệnh lý tim mạch với đội ngũ chuyên gia hàng đầu.",
        },
        {
            icon: <FaLungs className="text-blue-400 text-4xl mb-4" />,
            title: "Hô hấp",
            description: "Chẩn đoán và điều trị các bệnh lý phổi và hệ hô hấp chuyên sâu.",
        },
        {
            icon: <FaBrain className="text-purple-500 text-4xl mb-4" />,
            title: "Thần kinh",
            description: "Điều trị các rối loạn thần kinh với công nghệ và phương pháp tiên tiến.",
        },
        {
            icon: <FaBone className="text-yellow-500 text-4xl mb-4" />,
            title: "Cơ xương khớp",
            description: "Hỗ trợ phục hồi chức năng vận động và điều trị đau nhức xương khớp.",
        },
        {
            icon: <FaSpa className="text-pink-600 text-4xl mb-4" />,
            title: "Da liễu",
            description: "Chăm sóc sức khỏe da liễu với các phương pháp điều trị hiệu quả.",
        },
        {
            icon: <FaUserMd className="text-green-500 text-4xl mb-4" />,
            title: "Khám tổng quát",
            description: "Kiểm tra sức khỏe toàn diện giúp phát hiện sớm các nguy cơ tiềm ẩn.",
        },
    ];

    return (
        <section className="bg-blue-50 py-16 px-4">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-blue-700 mb-10">
                    Chuyên khoa dịch vụ
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {specialties.map((specialty, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex flex-col items-center text-center"
                        >
                            {specialty.icon}
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {specialty.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{specialty.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
