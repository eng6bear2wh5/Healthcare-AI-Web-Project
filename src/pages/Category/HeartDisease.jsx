import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function HeartDisease() {
    useEffect(() => {
        document.title = "Bệnh Tim - Health Trust";
    }, []);

    const articles = [
        {
            title: "Những hiểu biết cơ bản về bệnh tim",
            link: "https://careplusvn.com/vi/benh-tim-mach-la-gi-dau-hieu-som-nhat-va-cach-dieu-tri",
        },
        {
            title: "Cách phòng ngừa bệnh tim hiệu quả",
            link: "https://bvtamtridongthap.com.vn/vn/cach-phong-ngua-benh-tim-mach-hieu-qua-1573565876.html",
        },
        {
            title: "Điều trị bệnh tim: Các phương pháp hiện đại",
            link: "https://tamanhhospital.vn/dieu-tri-suy-tim/",
        },
    ];

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-blue-700">Bệnh Tim</h1>

            <section className="mb-6">
                <h2 className="text-xl font-semibold text-blue-600">Bệnh Tim là gì?</h2>
                <p className="text-gray-700">
                    Bệnh tim là một nhóm các vấn đề về tim mạch, bao gồm các vấn đề về các mạch máu, nhịp tim và cấu trúc của tim.
                    Nó có thể gây ra các vấn đề nghiêm trọng như đau thắt ngực, nhồi máu cơ tim, và đột quỵ.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold text-blue-600">Nguyên nhân của bệnh tim</h2>
                <p className="text-gray-700">
                    Các nguyên nhân chính gây ra bệnh tim bao gồm:
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                    <li>Tăng huyết áp (cao huyết áp)</li>
                    <li>Chế độ ăn uống không lành mạnh, nhiều chất béo bão hòa</li>
                    <li>Thiếu vận động thể chất</li>
                    <li>Hút thuốc lá và uống rượu bia quá mức</li>
                    <li>Tiền sử gia đình mắc bệnh tim</li>
                    <li>Béo phì và tiểu đường</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold text-blue-600">Triệu chứng của bệnh tim</h2>
                <p className="text-gray-700">
                    Các triệu chứng của bệnh tim có thể khác nhau tùy vào loại bệnh tim, nhưng một số triệu chứng phổ biến bao gồm:
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                    <li>Đau ngực hoặc cảm giác nặng nề ở ngực</li>
                    <li>Khó thở hoặc thở nhanh bất thường</li>
                    <li>Chóng mặt hoặc ngất xỉu</li>
                    <li>Cảm giác mệt mỏi, yếu đuối</li>
                    <li>Đau hoặc cảm giác tê ở cánh tay, cổ, hàm hoặc lưng</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold text-blue-600">Cách phòng ngừa bệnh tim</h2>
                <p className="text-gray-700">
                    Để phòng ngừa bệnh tim, bạn có thể thực hiện các biện pháp sau:
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                    <li>Ăn uống lành mạnh, giàu trái cây, rau quả và ngũ cốc nguyên hạt</li>
                    <li>Tập thể dục đều đặn, ít nhất 30 phút mỗi ngày</li>
                    <li>Kiểm soát cân nặng và giảm mỡ thừa</li>
                    <li>Tránh hút thuốc lá và uống rượu quá mức</li>
                    <li>Kiểm tra và duy trì huyết áp, cholesterol và đường huyết ở mức bình thường</li>
                    <li>Thực hiện kiểm tra sức khỏe định kỳ để phát hiện sớm các dấu hiệu bệnh tim</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold text-blue-600">Điều trị bệnh tim</h2>
                <p className="text-gray-700">
                    Điều trị bệnh tim phụ thuộc vào loại bệnh tim mà bạn mắc phải. Một số phương pháp điều trị bao gồm:
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                    <li>Thuốc điều trị huyết áp, cholesterol và các vấn đề khác liên quan đến tim</li>
                    <li>Phẫu thuật, bao gồm phẫu thuật mạch vành hoặc thay van tim</li>
                    <li>Can thiệp mạch (angioplasty) hoặc đặt stent để cải thiện dòng chảy của máu</li>
                    <li>Thay đổi lối sống bao gồm chế độ ăn uống, tập thể dục và giảm stress</li>
                </ul>
            </section>

            {/* Section dành cho bài báo liên quan */}
            <section className="mt-6">
                <h2 className="text-xl font-semibold text-blue-600">Bài báo liên quan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {articles.map((article, index) => (
                        <div key={index} className="bg-white p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">{article.title}</h3>
                            <p className="text-gray-700 mb-4">Đọc bài báo chi tiết để hiểu rõ hơn về bệnh tim.</p>
                            <Link
                                to={article.link}
                                target="_blank"
                                className="inline-block text-blue-600 hover:text-blue-800"
                            >
                                Đọc bài báo
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
