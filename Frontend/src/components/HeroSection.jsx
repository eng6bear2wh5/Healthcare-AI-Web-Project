
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "./ToastContext";

// --- Các thành phần và logic được tái sử dụng ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 flex flex-col justify-center items-center text-center hover:shadow-xl transition h-28 ${className}`}>
    {children}
  </div>
);

let hasShownAuthAlert = false;
function useAuthFetch() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  return useCallback(async (...args) => {
    const res = await fetch(...args);
    if (res.status === 401) {
      if (!hasShownAuthAlert) {
        hasShownAuthAlert = true;
        showToast("Bạn chưa đăng nhập! Vui lòng đăng nhập để sử dụng chức năng này!", "fail");
        navigate("/", { replace: true });
      }
      throw new Error("Unauthorized");
    }
    return res;
  }, [showToast, navigate]);
}

function calcAvg(arr, key) {
  const valid = arr.map(item => item?.[key]).filter(v => typeof v === 'number' && !isNaN(v));
  if (!valid.length) return null;
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
}
function calcAvgBloodPressure(arr) {
  const valid = arr.map(item => item?.blood_pressure).filter(Boolean);
  if (!valid.length) return null;
  const avgSys = Math.round(valid.reduce((a, b) => a + b.systolic, 0) / valid.length);
  const avgDia = Math.round(valid.reduce((a, b) => a + b.diastolic, 0) / valid.length);
  return `${avgSys}/${avgDia}`;
}

// --- Component gốc khi chưa đăng nhập ---
import logo from "../assets/medical-icon-png.png";
import herosection from "../assets/herosection.avif";

const OriginalHeroSection = () => (
    <div className="relative w-screen h-screen overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${herosection})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-sky-100/60 to-white/60 backdrop-blur-sm" />
        <motion.div className="relative z-10 flex flex-col items-center justify-center h-full px-6 md:px-20 text-gray-900 font-sans" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="flex items-center mb-6 space-x-3">
                <img src={logo} alt="HealthTrust Logo" className="h-12 w-12 rounded-full shadow-lg" />
                <span className="text-2xl md:text-3xl font-bold tracking-tight text-sky-700 opacity-70">HealthTrust</span>
            </div>
            <div className="opacity-70">
                <h1 className="text-4xl text-sky-700 md:text-6xl font-extrabold mb-4 leading-tight tracking-tight text-center" style={{ textShadow: "0 6px 24px rgba(0,0,0,0.18), 0 1px 0 #fff", fontFamily: "Inter, Nunito, Arial, sans-serif" }}>AI trong chăm sóc sức khỏe</h1>
                <p className="text-lg md:text-2xl max-w-2xl font-light text-center text-neutral-800" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>Phát hiện bệnh sớm bằng công nghệ thông minh, hỗ trợ bác sĩ ra quyết định chính xác hơn.</p>
            </div>
        </motion.div>
    </div>
);


// --- Component khi đã đăng nhập ---
const LoggedInView = ({ user }) => {
    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(user?.name);
    const authFetch = useAuthFetch();

    useEffect(() => {
        Promise.all([
            authFetch("/api/user", { credentials: "include" }).then(res => res.json()),
            authFetch("/api/health-metrics/me", { credentials: "include" }).then(res => res.json())
        ])
        .then(([userData, healthMetricsData]) => {
            setUsername(userData?.name);
            const weeklyData = healthMetricsData?.weekly_data || [];
            const metrics = {
                bloodPressure: calcAvgBloodPressure(weeklyData) || "N/A",
                heartRate: calcAvg(weeklyData, "heart_rate") ?? "N/A",
                bodyFat: calcAvg(weeklyData, "body_fat") ?? "N/A",
                bmi: calcAvg(weeklyData, "bmi") ?? "N/A",
                bloodSugar: calcAvg(weeklyData, "blood_glucose") ?? "N/A",
                cholesterol: `${calcAvg(weeklyData.map(item => ({ val: item?.cholesterol?.ldl })), "val") ?? "N/A"} / ${calcAvg(weeklyData.map(item => ({ val: item?.cholesterol?.hdl })), "val") ?? "N/A"}`,
                liverEnzymes: `${calcAvg(weeklyData.map(item => ({ val: item?.liver_enzymes?.sgpt })), "val") ?? "N/A"} / ${calcAvg(weeklyData.map(item => ({ val: item?.liver_enzymes?.sgot })), "val") ?? "N/A"}`,
                kidneyIndicators: `${calcAvg(weeklyData.map(item => ({ val: item?.kidney_index?.creatinine })), "val") ?? "N/A"} / ${calcAvg(weeklyData.map(item => ({ val: item?.kidney_index?.eGFR })), "val") ?? "N/A"}`,
            };
            setHealthData(metrics);
        })
        .catch(err => {
            console.error("Lỗi khi tải dữ liệu trang chủ:", err);
            setHealthData(null);
            setUsername(null);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [user, authFetch]);

    const healthMetricsDisplay = [
        { label: "🩸 Huyết áp", value: healthData?.bloodPressure, unit: "mmHg" },
        { label: "❤️ Nhịp tim", value: healthData?.heartRate, unit: "bpm" },
        { label: "⚖️ BMI", value: healthData?.bmi, unit: "" },
        { label: "🍬 Đường huyết", value: healthData?.bloodSugar, unit: "mg/dL" },
        { label: "💪 Tỷ lệ mỡ", value: healthData?.bodyFat, unit: "%" },
        { label: "🧪 Cholesterol (LDL/HDL)", value: healthData?.cholesterol, unit: "mg/dL" },
        { label: "🧫 Men gan (SGPT/SGOT)", value: healthData?.liverEnzymes, unit: "U/L" },
        { label: "📉 Chỉ số thận (Crea/eGFR)", value: healthData?.kidneyIndicators, unit: "" },
    ];

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${herosection})` }} />
            <div className="absolute inset-0 bg-sky-50/60 backdrop-blur-sm" />
            <div className="relative z-10 flex items-center justify-center h-full p-4">
                 <motion.div
                    className="w-full max-w-4xl mx-auto bg-white/60 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-8">
                        {loading ? (
                            // Hiển thị khung xương (skeleton) cho văn bản trong lúc tải
                            <>
                                <div className="h-9 w-3/4 bg-white/30 rounded-lg animate-pulse mb-3"></div>
                                <div className="h-14 w-full bg-white/30 rounded-lg animate-pulse"></div>
                            </>
                        ) : (
                            // Hiển thị văn bản thật sau khi tải xong
                            <>
                                <h2 className="text-3xl font-bold text-sky-800 mb-2">
                                    Xin chào {username || "bạn"}!
                                </h2>
                                <p className="text-lg text-gray-700">
                                    HealthTrust rất vui được đồng hành cùng bạn. Dưới đây là tóm tắt các chỉ số sức khỏe của bạn.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {loading ? (
                             [...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white/50 rounded-2xl h-28 animate-pulse"></div>
                            ))
                        ) : (
                            healthMetricsDisplay.map(metric => (
                                <Card key={metric.label}>
                                    <p className="text-blue-700 font-semibold text-sm mb-2">{metric.label}</p>
                                    <div className="text-2xl font-bold text-gray-800">
                                        {metric.value}
                                        {metric.unit && <span className="text-base font-normal text-gray-500 ml-1">{metric.unit}</span>}
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                    
                    <div className="text-center mt-8">
                        <Link to="/personal-tracker" className="inline-block px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition-colors duration-300">
                            Dashboard cá nhân để xem chi tiết
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};


// --- Component chính ---
const HeroSection = () => {
  const { user } = useAuth();
  return user ? <LoggedInView user={user} /> : <OriginalHeroSection />;
};

export default HeroSection;