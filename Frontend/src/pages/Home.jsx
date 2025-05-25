import Banner from "../components/Banner";
import Articles from "../components/Articles";
import DiseaseDetectButton from "../components/DiseaseDetectButton";
import AboutHealthTrust from "../components/AboutHealthTrust";
import Specialties from "../components/Specialties";
import PromotionsAndEvents from "../components/PromotionsAndEvents";
import { useEffect } from "react";

function Home() {
    useEffect(() => {
        document.title = "Trang chủ - Health Trust";
    }, []);
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Banner />
            <AboutHealthTrust />
            <Specialties />
            <Articles />
            <PromotionsAndEvents />
            <DiseaseDetectButton />
        </div>
    );
}

export default Home;
