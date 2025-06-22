import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/ToastContext";

export default function BMICalculator() {
    useEffect(() => {
        document.title = "Tính BMI | HealthTrust";
    }, []);

    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState("");
    
    const [isSaving, setIsSaving] = useState(false); 
    const { user } = useAuth(); 
    const { showToast } = useToast(); 
    const navigate = useNavigate(); 

    const calculateBMI = () => {
        const h = parseFloat(height) / 100; // cm -> m
        const w = parseFloat(weight);

        if (!h || h <= 0 || !w || w <= 0) {
            showToast("Vui lòng nhập chiều cao và cân nặng hợp lệ.", "warning");
            return;
        }

        const result = w / (h * h);
        setBmi(result.toFixed(1));

        if (result < 18.5) setCategory("Thiếu cân");
        else if (result < 24.9) setCategory("Bình thường");
        else if (result < 29.9) setCategory("Thừa cân");
        else setCategory("Béo phì");
    };
    
    const handleSaveBMI = useCallback(async () => {
        if (!user) {
            showToast("Bạn cần đăng nhập để sử dụng chức năng này.", "error");
            navigate("/login");
            return;
        }

        if (!bmi) {
            showToast("Vui lòng tính BMI trước khi lưu.", "warning");
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch("/api/health-metrics/me", {
                credentials: "include",
            });

            if (!response.ok && response.status !== 404) {
                throw new Error("Không thể tải dữ liệu sức khỏe hiện tại.");
            }
            
            const existingData = response.status === 404 ? { weekly_data: [] } : await response.json();
            let weeklyData = existingData.weekly_data || [];

            const latestWeek = 4;
            let weekFound = false;
            
            weeklyData = weeklyData.map(weekItem => {
                if (weekItem.week === latestWeek) {
                    weekFound = true;
                    return { ...weekItem, bmi: parseFloat(bmi) };
                }
                return weekItem;
            });

            if (!weekFound) {
                weeklyData.push({ week: latestWeek, bmi: parseFloat(bmi) });
            }

            weeklyData.sort((a, b) => a.week - b.week);
            
            const body = { weekly_data: weeklyData };
            const saveResponse = await fetch("/api/health-metrics", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
            });

            if (!saveResponse.ok) {
                throw new Error("Lưu BMI thất bại.");
            }

            showToast(`Đã lưu BMI ${bmi} vào tuần mới nhất!`, "success");

        } catch (error) {
            console.error("Lỗi khi lưu BMI:", error);
            showToast(error.message || "Đã có lỗi xảy ra, vui lòng thử lại.", "error");
        } finally {
            setIsSaving(false);
        }
    }, [user, bmi, navigate, showToast]);

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Tính chỉ số khối cơ thể (BMI)</h2>

            <div className="space-y-4">
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Chiều cao (cm):</label>
                    <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Ví dụ: 170"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1 text-gray-700">Cân nặng (kg):</label>
                    <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Ví dụ: 65"
                    />
                </div>

                <button
                    onClick={calculateBMI}
                    className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                    Tính BMI
                </button>
            </div>

            {bmi && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center border border-blue-200">
                    <p className="text-xl font-semibold">Chỉ số BMI của bạn là:</p>
                    <p className="text-4xl font-bold text-blue-600 my-2">{bmi}</p>
                    <p className="text-lg mt-1">Phân loại: <span className="font-semibold text-blue-800">{category}</span></p>
                    
                    {/* --- NÚT LƯU --- */}
                    <div className="mt-4">
                        <button
                            onClick={handleSaveBMI}
                            disabled={isSaving}
                            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Đang lưu...' : '💾 Lưu kết quả vào tuần mới nhất'}
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                           Lưu ý: Chỉ số BMI của tuần mới nhất (Tuần 4) sẽ được ghi đè.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}