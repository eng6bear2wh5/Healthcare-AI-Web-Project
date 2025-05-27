import React, { useState } from "react";

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [idealWeight, setIdealWeight] = useState(null);

  const calculateIdealWeight = () => {
    const h = parseFloat(height);
    if (!h) {
      alert("Vui lòng nhập chiều cao hợp lệ.");
      return;
    }

    // Convert cm to inches
    const inches = h / 2.54;

    // Devine formula
    let ibw;
    if (gender === "male") {
      ibw = 50 + 2.3 * (inches - 60);
    } else {
      ibw = 45.5 + 2.3 * (inches - 60);
    }

    setIdealWeight(ibw.toFixed(1));
  };

  return (
    <div className="max-w-md mx-auto mt-10 mb-16 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Cân nặng lý tưởng</h2>

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
          <label className="block font-medium mb-1">Giới tính:</label>
          <select
            className="w-full p-2 border rounded"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        <button
          onClick={calculateIdealWeight}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Tính cân nặng lý tưởng
        </button>
      </div>

      {idealWeight && (
        <div className="mt-6 text-center">
          <p className="text-xl font-semibold">
            Cân nặng lý tưởng: <span className="text-blue-600">{idealWeight} kg</span>
          </p>
        </div>
      )}
    </div>
  );
}
