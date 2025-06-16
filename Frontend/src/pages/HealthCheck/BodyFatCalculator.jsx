import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/ToastContext";

export default function BodyFatCalculator() {
  useEffect(() => {
    document.title = "Tỉ lệ mỡ | HealthTrust";
  }, []);

  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [bodyFat, setBodyFat] = useState(null);
  const [advice, setAdvice] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const calculateBodyFat = () => {
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const w = parseFloat(waist);
    const hp = parseFloat(hip);

    if (!h || !n || !w || (gender === "female" && !hp)) {
      showToast("Vui lòng nhập đầy đủ và hợp lệ các số đo.", "warning");
      return;
    }
    if (gender === "male" && w <= n) {
      showToast("Vòng eo phải lớn hơn vòng cổ để tính chính xác.", "error");
      return;
    }
    if (gender === "female" && (w + hp) <= n) {
      showToast("Tổng vòng eo và hông phải lớn hơn vòng cổ.", "error");
      return;
    }

    let bf;
    if (gender === "male") {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.221 * Math.log10(h)) - 450;
    }

    const result = bf.toFixed(1);
    setBodyFat(result);

    let msg = "";
    if (gender === "male") {
      if (bf < 6) msg = "Mức rất thấp. Hãy tham khảo ý kiến chuyên gia.";
      else if (bf <= 24) msg = "Mức lý tưởng. Duy trì thói quen lành mạnh!";
      else msg = "Mức khá cao. Cân nhắc chế độ ăn và luyện tập.";
    } else {
      if (bf < 14) msg = "Mức rất thấp. Hãy tham khảo ý kiến chuyên gia.";
      else if (bf <= 31) msg = "Mức lý tưởng. Duy trì thói quen lành mạnh!";
      else msg = "Mức khá cao. Cân nhắc chế độ ăn và luyện tập.";
    }
    setAdvice(msg);
  };

  const handleSaveBodyFat = useCallback(async () => {
    if (!user) {
      showToast("Bạn cần đăng nhập để sử dụng chức năng này.", "error");
      navigate("/login");
      return;
    }
    if (!bodyFat) {
      showToast("Vui lòng tính Tỷ lệ mỡ trước khi lưu.", "warning");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/health-metrics/me", { credentials: "include" });
      if (!response.ok && response.status !== 404) {
        throw new Error("Không thể tải dữ liệu sức khỏe hiện tại.");
      }
      
      const existingData = response.status === 404 ? { weekly_data: [] } : await response.json();
      let weeklyData = existingData.weekly_data || [];

      const latestWeek = 4;
      let weekFound = false;
      
      // Sửa đổi dữ liệu: cập nhật trường 'body_fat'
      weeklyData = weeklyData.map(weekItem => {
          if (weekItem.week === latestWeek) {
              weekFound = true;
              return { ...weekItem, body_fat: parseFloat(bodyFat) };
          }
          return weekItem;
      });

      if (!weekFound) {
          weeklyData.push({ week: latestWeek, body_fat: parseFloat(bodyFat) });
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
          throw new Error("Lưu Tỷ lệ mỡ thất bại.");
      }

      showToast(`Đã lưu Tỷ lệ mỡ ${bodyFat}% vào tuần mới nhất!`, "success");

    } catch (error) {
        console.error("Lỗi khi lưu Tỷ lệ mỡ:", error);
        showToast(error.message || "Đã có lỗi xảy ra, vui lòng thử lại.", "error");
    } finally {
        setIsSaving(false);
    }
  }, [user, bodyFat, navigate, showToast]);

  return (
    <div className="max-w-md mx-auto mt-10 mb-16 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Tính tỉ lệ mỡ cơ thể</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="gender" className="block font-medium mb-1 text-gray-700">Giới tính:</label>
          <select
            id="gender"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        {/* Các ô input với styling được cải thiện */}
        {[
          { label: "Chiều cao (cm):", value: height, setter: setHeight, placeholder: "Ví dụ: 170" },
          { label: "Vòng cổ (cm):", value: neck, setter: setNeck, placeholder: "Đo ở điểm nhỏ nhất" },
          { label: "Vòng eo (cm):", value: waist, setter: setWaist, placeholder: "Đo ngang rốn" },
        ].map(field => (
          <div key={field.label}>
            <label className="block font-medium mb-1 text-gray-700">{field.label}</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        ))}

        {gender === "female" && (
          <div>
            <label className="block font-medium mb-1 text-gray-700">Vòng hông (cm):</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              placeholder="Đo ở điểm lớn nhất"
            />
          </div>
        )}

        <button
          onClick={calculateBodyFat}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Tính Tỷ lệ mỡ
        </button>
      </div>

      {bodyFat && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center border border-blue-200">
          <p className="text-xl font-semibold">Tỷ lệ mỡ cơ thể của bạn là:</p>
          <p className="text-4xl font-bold text-blue-600 my-2">{bodyFat}%</p>
          <p className="text-lg mt-1 text-gray-700">{advice}</p>

          {/* --- NÚT LƯU --- */}
          <div className="mt-4">
            <button
                onClick={handleSaveBodyFat}
                disabled={isSaving}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isSaving ? 'Đang lưu...' : '💾 Lưu kết quả vào tuần mới nhất'}
            </button>
            <p className="text-xs text-gray-500 mt-2">
                Lưu ý: Chỉ số tỷ lệ mỡ của tuần mới nhất (Tuần 4) sẽ được ghi đè.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}