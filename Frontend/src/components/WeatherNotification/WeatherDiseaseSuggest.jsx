import { useEffect, useState } from "react";
import { diseaseSuggestions } from "./diseaseSuggest";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export function WeatherDiseaseSuggest() {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [disease, setDisease] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // Sửa typo ở đây: longitude (không phải longtitude)
        const { latitude, longitude } = pos.coords;
        try {
          //Gọi API thời tiết
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
          console.log("Gọi API:", url);
          const res = await fetch(url);
          const data = await res.json();

          console.log("Kết quả API thời tiết:", data);

          if (data.cod && data.cod !== 200) {
            // Nếu API trả về lỗi
            setError(`Lỗi API thời tiết: ${data.message || data.cod}`);
            setLoading(false);
            return;
          }

          setWeather(data);
          setError(null);

          //Mapping gợi ý bệnh
          const condition = data.weather?.[0]?.main;
          const found = diseaseSuggestions.find(
            (item) => item.condition === condition
          );
          setDisease(found ? found.diseases : []);
        } catch (e) {
          console.error("Lỗi khi gọi API thời tiết:", e);
          setError("Không lấy được dữ liệu thời tiết (lỗi fetch)");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Lỗi lấy vị trí:", err);
        setError("Không lấy được vị trí: " + err.message);
        setLoading(false);
      }
    );
  }, []);
  return { loading, weather, disease, error };
}