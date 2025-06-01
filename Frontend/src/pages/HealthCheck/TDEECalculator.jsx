import React, { useState, useEffect } from "react";

export default function TDEECalculator() {
  useEffect(() => {
    document.title = "Tính lượng calo | HealthTrust";
  }, []);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("1.2");
  const [tdee, setTdee] = useState(null);

  const calculateTDEE = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);
    const act = parseFloat(activity);

    if (!h || !w || !a) {
      alert("Vui lòng nhập chiều cao, cân nặng và tuổi hợp lệ.");
      return;
    }

    // BMR theo Mifflin-St Jeor
    let bmr;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const result = Math.round(bmr * act);
    setTdee(result);
  };

  return (
    <div className="max-w-md mx-auto mt-10 mb-16 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Tính lượng calo cần thiết</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="height" className="block font-medium mb-1">Chiều cao (cm):</label>
          <input
            id="height"
            type="number"
            className="w-full p-2 border rounded"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Nhập chiều cao"
          />
        </div>

        <div>
          <label htmlFor="weight" className="block font-medium mb-1">Cân nặng (kg):</label>
          <input
            id="weight"
            type="number"
            className="w-full p-2 border rounded"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Nhập cân nặng"
          />
        </div>

        <div>
          <label htmlFor="age" className="block font-medium mb-1">Tuổi:</label>
          <input
            id="age"
            type="number"
            className="w-full p-2 border rounded"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Nhập tuổi"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block font-medium mb-1">Giới tính:</label>
          <select
            id="gender"
            className="w-full p-2 border rounded"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        <div>
          <label htmlFor="activity" className="block font-medium mb-1">Mức độ hoạt động:</label>
          <select
            id="activity"
            className="w-full p-2 border rounded"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            <option value="1.2">Ít vận động</option>
            <option value="1.375">Vận động nhẹ</option>
            <option value="1.55">Vận động vừa phải</option>
            <option value="1.725">Năng động</option>
            <option value="1.9">Rất năng động</option>
          </select>
        </div>

        <button
          onClick={calculateTDEE}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Tính lượng calo
        </button>
      </div>

      {tdee && (
        <div className="mt-6 text-center">
          <p className="text-xl font-semibold">
            Nhu cầu calo mỗi ngày: <span className="text-blue-600">{tdee} kcal</span>
          </p>
        </div>
      )}
    </div>
  );
}