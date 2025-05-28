
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import picture1 from '../assets/pic1.jpg';
import picture2 from '../assets/pic2.jpg'; // Bạn có thể thêm hình ảnh khác nếu cần
import picture3 from '../assets/pic3.avif';


const banners = [
    { image: picture1 },
    { image: picture2 },
    { image: picture3 },
];

export default function Banner() {
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const { image } = banners[currentBanner];

    return (
        <section className="w-full h-[400px] md:h-[500px] relative overflow-hidden mb-6">
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentBanner}
                    src={image}
                    alt="Banner"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                />
            </AnimatePresence>
        </section>
    );
}
