import { useEffect } from "react";
import DiseaseDetectButton from "../../components/DiseaseDetectButton";

const partners = [
    {
        name: "Bệnh viện Đa khoa Quốc tế Vinmec",
        description: "Hợp tác trong việc nghiên cứu và phát triển công nghệ y tế tiên tiến.",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbMOTKCX23wAP098EuU8pmY33o3QY-xTen6A&s"
    },
    {
        name: "Đại học Y Dược TP.HCM",
        description: "Đào tạo và nghiên cứu chuyên sâu về lĩnh vực y tế cộng đồng.",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuRdp-5TDYIBcQDhoqw8AcaYap1oTxuvGd5A&s"
    },
    {
        name: "WHO (Tổ chức Y tế Thế giới)",
        description: "Hợp tác phát triển chương trình chăm sóc sức khỏe toàn diện.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Flag_of_WHO.svg/1200px-Flag_of_WHO.svg.png"
    },
];

function Partner() {
    useEffect(() => {
        document.title = "Đối tác - Health Trust";
    }, []);
    return (
        <div className="max-w-5xl mx-auto p-4 relative">
            <h1 className="text-2xl font-bold mb-6 text-blue-700">Đối tác của Health Trust</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner, index) => (
                    <div
                        key={index}
                        className="p-4 border rounded shadow hover:shadow-lg transition duration-300 flex flex-col items-center text-center"
                    >
                        <img
                            src={partner.logo}
                            alt={partner.name}
                            className="w-24 h-24 object-cover rounded-full mb-4"
                        />
                        <h2 className="text-lg font-semibold text-blue-600">{partner.name}</h2>
                        <p className="text-gray-700 text-sm mt-2">{partner.description}</p>
                    </div>
                ))}
            </div>

            <DiseaseDetectButton />
        </div>
    );
}

export default Partner;
