//import ChatButton from "../../components/ChatButton";
// Dynamic import (mới)
import React, { Suspense } from "react";
const DiseaseDetectButton = React.lazy(() =>
  import("../../components/DiseaseDetectButton")
);
import { useEffect } from "react";

const achievements = [
  {
    title: "Giải thưởng Y tế Thông minh 2024",
    description:
      "Health Trust được vinh danh với giải thưởng cao quý vì những đóng góp nổi bật trong chăm sóc sức khỏe cộng đồng.",
    image:
      "https://nhakhoakim.com/wp-content/uploads/2025/02/Thanh-tuu-Y-khoa-Viet-Nam-2024.jpg",
  },
  {
    title: "Top 10 Dịch vụ Sức khỏe Sáng tạo",
    description:
      "Nằm trong top 10 đơn vị cung cấp dịch vụ sức khỏe sáng tạo nhất năm 2023 theo bình chọn từ người dùng.",
    image:
      "https://image.viettimes.vn/w800/Uploaded/2025/livospwi/2022_02_03/chuyen-doi-so-y-te-3669.jpg",
  },
  {
    title: "Chứng nhận ISO 9001:2015",
    description:
      "Health Trust đạt tiêu chuẩn quản lý chất lượng quốc tế trong vận hành và cung cấp dịch vụ y tế.",
    image:
      "https://icert.vn/pic/New/iso-9001-_637033763634983600.jpg",
  },
  {
    title: "Đối tác chiến lược của Bộ Y tế",
    description:
      "Được lựa chọn làm đối tác trong nhiều chiến dịch nâng cao nhận thức sức khỏe quốc gia.",
    image:
      "https://moh.gov.vn/documents/174521/1538901/21.4.2023+BT+DHL+phat+bieu+1.jpg/3f836aa5-8647-450e-87c2-11098cee3f0d?t=1682171873797",
  },
];

function Achievement() {
  useEffect(() => {
    document.title = "Thành tựu và Giải thưởng | HealthTrust";
  }, []);
  return (
    <div className="max-w-6xl mx-auto p-4 relative">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Thành tựu và Giải thưởng
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {achievements.map((item, index) => (
          <div
            key={index}
            className="border rounded p-4 shadow hover:shadow-lg transition duration-300"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h2 className="text-lg font-semibold text-blue-600">
              {item.title}
            </h2>
            <p className="text-gray-700 mt-2">{item.description}</p>
          </div>
        ))}
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <DiseaseDetectButton />
      </Suspense>
    </div>
  );
}

export default Achievement;
