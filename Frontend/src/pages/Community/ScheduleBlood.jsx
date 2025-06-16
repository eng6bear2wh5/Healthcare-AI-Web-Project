// src/pages/Event.jsx
import { useState, useEffect, Suspense, lazy } from "react";

const DiseaseDetectButton = lazy(() => import("../../components/DiseaseDetectButton"));

export default function Event() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Lịch hiến máu | HealthTrust";
    
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/blood-donation-events');
        if (!response.ok) {
          throw new Error('Không thể tải lịch hiến máu. Vui lòng thử lại.');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  if (isLoading) {
    return <div className="max-w-4xl mx-auto p-4 text-center">Đang tải lịch hiến máu...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-4 text-center text-red-600">Lỗi: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold mt-6 mb-8 text-blue-700 text-center">
        Lịch hiến máu
      </h1>
      <div className="space-y-6">
        {events.length > 0 ? (
          events.map((event, idx) => (
            <div
              key={event._id || idx} // Ưu tiên dùng _id từ database
              className="flex items-center border rounded-lg overflow-hidden shadow hover:shadow-md transition"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-48 h-48 object-cover"
                loading="lazy"
              />
              <div className="flex-1 p-4">
                <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                  <a href={event.link} target="_blank" rel="noopener noreferrer">
                    {event.title}
                  </a>
                </h2>
                <p className="text-sm text-black-500 mt-1">{event.date}</p>
                <p className="text-sm text-black-500 mt-1">
                  <a
                    href={event.addressLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    📍Vị trí {event.address}
                  </a>
                </p>
                <p className="text-gray-700 mt-2">{event.description}</p>
              </div>
              <div className="p-4 text-right">
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Đặt lịch
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">Hiện chưa có lịch hiến máu nào.</p>
        )}
      </div>
      <div className="mt-8">
        <Suspense fallback={<div>Loading...</div>}>
          <DiseaseDetectButton />
        </Suspense>
      </div>
    </div>
  );
}