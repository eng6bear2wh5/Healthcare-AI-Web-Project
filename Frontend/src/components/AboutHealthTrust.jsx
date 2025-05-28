import aboutImage from '../assets/Picture_1.jpg'; // Bạn thay bằng ảnh bạn có
import { useNavigate } from "react-router-dom";

export default function AboutHealthTrust() {
    const navigate = useNavigate();
    return (


        <section className="bg-white py-16 px-4" >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                {/* Ảnh minh họa */}
                <div className="flex-1">
                    <img
                        src={aboutImage}
                        alt="Về Health Trust"
                        className="w-full h-auto rounded-xl shadow-md object-cover"
                    />
                </div>

                {/* Nội dung giới thiệu */}
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-blue-700 mb-4">
                        Về Health Trust
                    </h2>
                    <p className="text-gray-700 text-lg mb-6">
                        <span className="font-semibold text-blue-600">Health Trust</span> là nền tảng sức khỏe toàn diện, kết nối bạn với những dịch vụ y tế chất lượng và đội ngũ chuyên gia hàng đầu.
                        Chúng tôi cam kết đồng hành cùng bạn trên hành trình chăm sóc sức khỏe chủ động, dễ dàng và an toàn.
                    </p>
                    <p className="text-gray-600 text-md mb-6">
                        Với đội ngũ y bác sĩ uy tín, công nghệ hiện đại và mạng lưới đối tác rộng khắp, Health Trust mang đến trải nghiệm chăm sóc sức khỏe chuyên nghiệp, tiện lợi và thân thiện nhất cho mọi người.
                    </p>

                    <button
                        onClick={() => navigate('/AboutHealthTrust/Mission')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-800 transition cursor-pointer"
                    >
                        Tìm hiểu thêm
                    </button>

                </div>
            </div>
        </section>
    );
}
