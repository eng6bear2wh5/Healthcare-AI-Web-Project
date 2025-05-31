import Articles from "../components/Articles";
import DiseaseDetectButton from "../components/DiseaseDetectButton";
import AboutHealthTrust from "../components/AboutHealthTrust";
import Specialties from "../components/Specialties";
import PromotionsAndEvents from "../components/PromotionsAndEvents";
import { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import { Helmet } from "react-helmet";

function Home() {
    useEffect(() => {
        document.title = "Trang chủ | HealthTrust";
    }, []);

    return (
        <>

            <Helmet>
                <title>Trang chủ | HealthTrust</title>
                <meta
                    name="description"
                    content="Trang chủ của HealthTrust - nền tảng chăm sóc sức khỏe thông minh với AI, cung cấp thông tin bệnh, thuốc và hỗ trợ chẩn đoán."
                />
            </Helmet>

            <HeroSection />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <AboutHealthTrust />
                <Specialties />
                <Articles />
                <PromotionsAndEvents />
                <DiseaseDetectButton />
            </div>
        </>
    );
}

export default Home;
