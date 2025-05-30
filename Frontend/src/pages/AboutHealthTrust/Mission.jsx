import { useEffect } from "react";

function Mission() {
    useEffect(() => {
        document.title = "Sứ mệnh | HealthTrust";
    }, []);
    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Sứ mệnh của chúng tôi</h1>
            <p className="text-gray-700 text-lg mb-4">
                Tại <span className="font-semibold text-blue-500">Health Trust</span>, chúng tôi cam kết đem lại giải pháp chăm sóc sức khỏe toàn diện, dễ tiếp cận và cá nhân hóa cho mọi người.
            </p>
            <p className="text-gray-700 text-lg mb-4">
                Sứ mệnh của chúng tôi là:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
                <li>Hỗ trợ người dùng theo dõi tình trạng sức khỏe theo thời gian thực.</li>
                <li>Cung cấp thông tin và lời khuyên chính xác từ các chuyên gia.</li>
                <li>Tạo nên cộng đồng gắn kết cùng nhau cải thiện sức khỏe.</li>
                <li>Ứng dụng trí tuệ nhân tạo để đề xuất kế hoạch chăm sóc cá nhân hóa.</li>
            </ul>
            <p className="text-gray-700 text-lg mt-6">
                Chúng tôi tin rằng, sức khỏe là nền tảng của hạnh phúc. Hãy để <span className="font-semibold text-blue-500">Health Trust</span> đồng hành cùng bạn trên hành trình sống khỏe mạnh hơn mỗi ngày.
            </p>
        </div>
    );
}

export default Mission;
