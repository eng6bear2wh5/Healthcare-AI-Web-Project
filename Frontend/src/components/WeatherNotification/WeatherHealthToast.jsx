import React, { useEffect, useState } from "react";
import { WeatherDiseaseSuggest } from "./WeatherDiseaseSuggest";
import Toast from "../Toast";

function ToastMessage({ diseases }) {
  if (!diseases.length) return null;
  return (
    <div>
      <b>Cảnh báo sức khỏe hôm nay:</b>
      <ul className="list-disc ml-4 mt-1">
        {diseases.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    </div>
  );
}

export default function WeatherHealthToast() {
  const { loading, disease, error } = WeatherDiseaseSuggest();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!loading && disease.length > 0) setShow(true);
  }, [loading, disease]);
  useEffect(() => {
    if (error) setShow(true);
  }, [error]);

  return (
    <>
      {show && (disease.length > 0 || error) && (
        <Toast
          message={
            error ? (
              <span className="font-semibold">Lỗi: {error}</span>
            ) : (
              <ToastMessage diseases={disease} />
            )
          }
          type={error ? "error" : "info"}
          onClose={() => setShow(false)}
        />
      )}
    </>
  );
}