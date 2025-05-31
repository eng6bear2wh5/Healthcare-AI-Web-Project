import Articles from "../components/Articles";
import DiseaseDetectButton from "../components/DiseaseDetectButton";
import AboutHealthTrust from "../components/AboutHealthTrust";
import Specialties from "../components/Specialties";
import PromotionsAndEvents from "../components/PromotionsAndEvents";
import { useEffect } from "react";
import HeroSection from "../components/HeroSection";

function Home() {
    useEffect(() => {
        document.title = "Trang chủ | HealthTrust";
    }, []);
    return (
        <>
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
