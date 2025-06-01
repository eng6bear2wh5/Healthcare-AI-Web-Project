import { useEffect, Suspense, lazy } from "react";
import HeroSection from "../components/HeroSection";
import { Helmet } from "react-helmet";

const Articles = lazy(() => import("../components/Articles"));
const DiseaseDetectButton = lazy(() => import("../components/DiseaseDetectButton"));
const AboutHealthTrust = lazy(() => import("../components/AboutHealthTrust"));
const Specialties = lazy(() => import("../components/Specialties"));
const PromotionsAndEvents = lazy(() => import("../components/PromotionsAndEvents"));

function Home() {
    useEffect(() => {
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
                <Suspense fallback={<div>Đang tải...</div>}>
                    <AboutHealthTrust />
                    <Specialties />
                    <Articles />
                    <PromotionsAndEvents />
                    <DiseaseDetectButton />
                </Suspense>
            </div>
        </>
    );
}

export default Home;