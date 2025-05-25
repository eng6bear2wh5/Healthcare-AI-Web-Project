import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import picture1 from '../assets/Picture_3.jpg';
import picture2 from '../assets/Picture_2.jpg'; // Thêm hình ảnh khác nếu cần

const banners = [
    { image: picture1 },
    { image: picture2 },
    // Thêm ảnh mới nếu cần
];

export default function Banner() {
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000); // 5 giây đổi ảnh

        return () => clearInterval(interval);
    }, []);

    const { image } = banners[currentBanner];

    return (
        <section className="w-full h-[400px] md:h-[500px] relative overflow-hidden">
            <motion.div
                key={currentBanner}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="w-full h-full"
            >
                <img
                    src={image}
                    alt="Banner"
                    className="w-full h-full object-cover"
                />
            </motion.div>
        </section>
    );
}
