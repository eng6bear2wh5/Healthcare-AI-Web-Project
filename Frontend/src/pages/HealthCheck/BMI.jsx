import React, { useState } from "react";

export default function BMICalculator() {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState("");

    const calculateBMI = () => {
        const h = parseFloat(height) / 100; // cm -> m
        const w = parseFloat(weight);

        if (!h || !w) {
            alert("Vui lòng nhập chiều cao và cân nặng hợp lệ.");
            return;
        }

        const result = w / (h * h);
        setBmi(result.toFixed(1));

        // Phân loại BMI theo WHO
        if (result < 18.5) setCategory("Thiếu cân");
        else if (result < 24.9) setCategory("Bình thường");
        else if (result < 29.9) setCategory("Thừa cân");
        else setCategory("Béo phì");
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Tính chỉ số BMI</h2>

            <div className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Chiều cao (cm):</label>
                    <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Nhập chiều cao"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Cân nặng (kg):</label>
                    <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Nhập cân nặng"
                    />
                </div>

                <button
                    onClick={calculateBMI}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Tính BMI
                </button>
            </div>

            {bmi && (
                <div className="mt-6 text-center">
                    <p className="text-xl font-semibold">Chỉ số BMI: <span className="text-blue-600">{bmi}</span></p>
                    <p className="text-lg mt-1">Phân loại: <span className="font-medium">{category}</span></p>
                </div>
            )}
        </div>
    );
}
