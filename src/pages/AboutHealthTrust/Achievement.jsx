import ChatButton from "../../components/ChatButton";
import DiseaseDetectButton from "../../components/DiseaseDetectButton";
import { useEffect } from "react";

const achievements = [
    {
        title: "Giải thưởng Y tế Quốc gia 2022",
        description: "Health Trust được vinh danh với giải thưởng cao quý vì những đóng góp nổi bật trong chăm sóc sức khỏe cộng đồng.",
        image: "https://hcdc.vn/public/img/02bf8460bf0d6384849ca010eda38cf8e9dbc4c7/images/dangbai1/images/le-trao-giai-thanh-tuu-y-khoa-viet-nam-2022-vinh-danh-nhung-cong-trinh-y-hoc-tieu-bieu-cua-y-te-cong-dong/images/image015.jpg",
    },
    {
        title: "Top 10 Dịch vụ Sức khỏe Sáng tạo",
        description: "Nằm trong top 10 đơn vị cung cấp dịch vụ sức khỏe sáng tạo nhất năm 2023 theo bình chọn từ người dùng.",
        image: "https://www.panamamaritimeconference.com/wp-content/uploads/2022/06/top-10-dich-vu-y-te-tai-nha-tot-nhat-tp-hcm.jpg"
    },
    {
        title: "Chứng nhận ISO 9001:2015",
        description: "Health Trust đạt tiêu chuẩn quản lý chất lượng quốc tế trong vận hành và cung cấp dịch vụ y tế.",
        image: "https://dangkythuonghieu.org/upload/images/dich-vu-cap-chung-chi-chung-nhan-iso-9001-2015-tron-goi-tai-tphcm.jpg",
    },
    {
        title: "Đối tác chiến lược của Bộ Y tế",
        description: "Được lựa chọn làm đối tác trong nhiều chiến dịch nâng cao nhận thức sức khỏe quốc gia.",
        image: "https://suckhoedoisong.qltns.mediacdn.vn/zoom/720_450/324455921873985536/2025/3/9/dsc8486-17415130732371303477485-0-0-4046-6474-crop-174151311055259910059.jpg",
    },
];

function Achievement() {
    useEffect(() => {
        document.title = "Thành tựu và Giải thưởng - Health Trust";
    }, []);
    return (
        <div className="max-w-6xl mx-auto p-4 relative">
            <h1 className="text-2xl font-bold mb-6 text-blue-700">Thành tựu và Giải thưởng</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {achievements.map((item, index) => (
                    <div key={index} className="border rounded p-4 shadow hover:shadow-lg transition duration-300">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover mb-4 rounded"
                        />
                        <h2 className="text-lg font-semibold text-blue-600">{item.title}</h2>
                        <p className="text-gray-700 mt-2">{item.description}</p>
                    </div>
                ))}

            </div>
            <DiseaseDetectButton />
        </div>
    );
}

export default Achievement;