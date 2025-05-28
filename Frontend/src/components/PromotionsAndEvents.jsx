import { motion } from "framer-motion";

export default function PromotionsAndEvents() {
  const items = [
    {
      title: "Chương trình chăm sóc sức khỏe Vinmec",
      description: "Chương trình chăm sóc sức khỏe Vinmec được thiết kế với chính sách đặc quyền miễn phí khám sức khỏe tổng quát cùng với các ưu đãi vượt trội khi sử dụng các dịch vụ sàng lọc và điều trị.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP32-g5M2YubC_5VeaazrDy3F-xsNTXOkT8w&s", 
      link: "https://www.vinmec.com/vie/bai-viet/chuong-trinh-cham-soc-suc-khoe-vinmec",
    },
    {
      title: "Ngày Hiến máu Thế giới – 14/6/2025",
      description: "Hãy tham gia cùng chúng tôi trong ngày hiến máu thế giới để cứu sống những người cần máu.",
      image: "https://cdcnghean.vn/uploads/news/2024_06/qt1.png",
      link: "https://thuvienphapluat.vn/phap-luat-doanh-nghiep/cau-hoi-thuong-gap/ngay-hien-mau-the-gioi-2025-la-ngay-nao-nguoi-lao-dong-co-duoc-nghi-le-huong-nguyen-luong-ngay-hien-mau-the-gioi-2025-khong-10289.html#:~:text=Ng%C3%A0y%2014%2F6%20kh%C3%B4ng%20ch%E1%BB%89,ng%C3%A0y%2014%2F6%2F2025.",
    },
    {
      title: "Lễ phát động Tháng hành động quốc gia về An toàn, vệ sinh lao động trong ngành Y tế",
      description: "Chương trình nhằm nâng cao nhận thức và trách nhiệm của các cấp, ngành, doanh nghiệp và người lao động trong việc đảm bảo an toàn, vệ sinh lao động, đặc biệt trong ngành y tế với nhiều nguy cơ rủi ro nghề nghiệp.",
      image: "https://moh.gov.vn/documents/174521/2553320/7.5.2025+TT+NTLH+3.png/99901280-cde2-457d-88f1-b84d597db9d0?t=1746609688650",
      link: "https://moh.gov.vn/tin-noi-bat/-/asset_publisher/3Yst7YhbkA5j/content/le-phat-ong-huong-ung-thang-hanh-ong-quoc-gia-ve-an-toan-ve-sinh-lao-ong-nam-2025-trong-nganh-y-te",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
    }),
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-12">
        Sự kiện & Khuyến mãi
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {items.map((item, index) => (
          <motion.a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-5">{item.description}</p>
              <span className="inline-block text-sm font-medium text-blue-500 hover:underline">
                Xem chi tiết &rarr;
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
