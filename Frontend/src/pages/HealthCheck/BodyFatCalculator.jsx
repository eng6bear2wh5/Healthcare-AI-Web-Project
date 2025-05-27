import React, { useState } from "react";

export default function BodyFatCalculator() {
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [bodyFat, setBodyFat] = useState(null);
  const [advice, setAdvice] = useState("");

  const calculateBodyFat = () => {
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const w = parseFloat(waist);
    const hp = parseFloat(hip);

    // Validate inputs
    if (!h || !n || !w || (gender === "female" && !hp)) {
      alert("Vui lòng nhập đầy đủ số liệu (bao gồm cả vòng hông với nữ). Và đảm bảo tất cả lớn hơn 0.");
      return;
    }

    // Validate realistic measures for male: waist must be > neck
    if (gender === "male" && w <= n) {
      alert("Vòng eo phải lớn hơn vòng cổ để tính chính xác.");
      return;
    }
    // For female: waist+hip must be > neck
    if (gender === "female" && (w + hp) <= n) {
      alert("Tổng vòng eo và hông phải lớn hơn vòng cổ để tính chính xác.");
      return;
    }

    // US Navy Method
    let bf;
    if (gender === "male") {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.221 * Math.log10(h)) - 450;
    }

    const result = bf.toFixed(1);
    setBodyFat(result);

    // Advice based on ranges
    let msg = "";
    if (gender === "male") {
      if (bf < 6) msg = "Bạn đang ở mức rất thấp. Hãy tham khảo ý kiến chuyên gia về dinh dưỡng và tập luyện.";
      else if (bf <= 24) msg = "% Mỡ cơ thể trong khoảng lý tưởng. Duy trì thói quen lành mạnh!";
      else msg = "Bạn hơi cao hơn mức khuyến nghị. Cân nhắc chế độ ăn uống và luyện tập.";
    } else {
      if (bf < 14) msg = "Bạn đang ở mức rất thấp. Hãy tham khảo ý kiến chuyên gia về dinh dưỡng và tập luyện.";
      else if (bf <= 31) msg = "% Mỡ cơ thể trong khoảng lý tưởng. Duy trì thói quen lành mạnh!";
      else msg = "Bạn hơi cao hơn mức khuyến nghị. Cân nhắc chế độ ăn uống và luyện tập.";
    }
    setAdvice(msg);
  };

  return (
    <div className="max-w-md mx-auto mt-10 mb-16 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Tính tỉ lệ mỡ cơ thể</h2>

      <div className="space-y-4">
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
          <label className="block font-medium mb-1">Vòng cổ (cm):</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
            placeholder="Nhập vòng cổ"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Vòng eo (cm):</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            placeholder="Nhập vòng eo"
          />
        </div>

        {gender === "female" && (
          <div>
            <label className="block font-medium mb-1">Vòng hông (cm):</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              placeholder="Nhập vòng hông"
            />
          </div>
        )}

        <button
          onClick={calculateBodyFat}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Tính tỉ lệ mỡ cơ thể
        </button>
      </div>

      {bodyFat && (
        <div className="mt-6 text-center">
          <p className="text-xl font-semibold">
            Body Fat: <span className="text-blue-600">{bodyFat}%</span>
          </p>
          <p className="text-lg mt-2 text-gray-700">{advice}</p>
        </div>
      )}
    </div>
  );
}
