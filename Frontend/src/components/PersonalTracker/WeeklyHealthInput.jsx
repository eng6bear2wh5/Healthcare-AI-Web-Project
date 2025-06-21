import React, { useState, useEffect } from "react";
import { useToast } from "../ToastContext";
import { useNavigate } from "react-router-dom";

let hasShownAuthAlert = false; 

function useAuthFetch(navigate) {
  return async (...args) => {
    const res = await fetch(...args);
    if (res.status === 401) {
      if (!hasShownAuthAlert) {
        hasShownAuthAlert = true;
        alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để sử dụng chức năng này.");
        navigate("/", { replace: true });
      }
      throw new Error("Unauthorized");
    }
    return res;
  };
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className = "" }) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}

function Input({ type = "text", className = "", ...props }) {
  return (
    <input
      type={type}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`bg-[#0180CC] text-white font-medium py-2.5 px-4 rounded-md hover:bg-[#0063A3] focus:outline-none focus:ring-2 focus:ring-[#0180CC] focus:ring-offset-2 transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

const weeks = [1, 2, 3, 4];
const fields = [
  { label: "BMI", name: "bmi", unit: "", type: "number", step: "0.1" },
  {
    label: "Huyết áp",
    name: "blood_pressure",
    unit: "mmHg",
    type: "double",
    subFields: [
      { name: "systolic", label: "tâm thu" },
      { name: "diastolic", label: "tâm trương" },
    ],
  },
  { label: "Nhịp tim", name: "heart_rate", unit: "bpm", type: "number" },
  {
    label: "Đường huyết",
    name: "blood_glucose",
    unit: "mg/dL",
    type: "number",
  },
  {
    label: "Tỷ lệ mỡ cơ thể",
    name: "body_fat",
    unit: "%",
    type: "number",
    step: "0.1",
  },
  {
    label: "Cholesterol",
    name: "cholesterol",
    unit: "mg/dL",
    type: "double",
    subFields: [
      { name: "ldl", label: "LDL" },
      { name: "hdl", label: "HDL" },
    ],
  },
  {
    label: "Men gan",
    name: "liver_enzymes",
    unit: "U/L",
    type: "double",
    subFields: [
      { name: "sgpt", label: "SGPT" },
      { name: "sgot", label: "SGOT" },
    ],
  },
  {
    label: "Chỉ số thận",
    name: "kidney_index",
    unit: "mg/dL - mL/min/1.73m²",
    type: "double",
    subFields: [
      { name: "creatinine", label: "Creatinine" },
      { name: "eGFR", label: "eGFR" },
    ],
  },
];

export default function WeeklyHealthInput() {
  const navigate = useNavigate();
  const authFetch = useAuthFetch(navigate);

  useEffect(() => {
    document.title = "PersonalTracker | HealthTrust";
  }, []);
  const [data, setData] = useState({
    1: {},
    2: {},
    3: {},
    4: {},
  });
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { showToast } = useToast();

  // Kiểm tra đăng nhập trước khi render nội dung
  useEffect(() => {
    authFetch("/api/health-metrics/me", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((response) => {
        const newData = { 1: {}, 2: {}, 3: {}, 4: {} };
        response?.weekly_data?.forEach((weekItem) => {
          const week = weekItem.week;
          if (week >= 1 && week <= 4) {
            newData[week] = weekItem;
          }
        });
        setData(newData);
        setIsAuthChecked(true); // Đã xác thực xong, cho phép render
      })
      .catch((err) => {
      });
  }, []);

  const handleChange = (week, field, value) => {
    setData((prev) => ({
      ...prev,
      [week]: { ...prev[week], [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const weekly_data = Object.entries(data).map(([week, values]) => ({
      week: parseInt(week),
      bmi: parseFloat(values.bmi),
      blood_pressure: {
        systolic: parseInt(values.blood_pressure?.systolic),
        diastolic: parseInt(values.blood_pressure?.diastolic),
      },
      heart_rate: parseInt(values.heart_rate),
      blood_glucose: parseFloat(values.blood_glucose),
      body_fat: parseFloat(values.body_fat),
      cholesterol: {
        ldl: parseFloat(values.cholesterol?.ldl),
        hdl: parseFloat(values.cholesterol?.hdl),
      },
      liver_enzymes: {
        sgpt: parseFloat(values.liver_enzymes?.sgpt),
        sgot: parseFloat(values.liver_enzymes?.sgot),
      },
      kidney_index: {
        creatinine: parseFloat(values.kidney_index?.creatinine),
        eGFR: parseFloat(values.kidney_index?.eGFR),
      },
    }));

    const body = { weekly_data };

    authFetch("/api/health-metrics", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    })
      .then((res) => res.text())
      .then((data) => {
        // console.log("Thành công " + data);
        showToast("Đã cập nhật 4 tuần!", "success");
      })
      .catch((err) => console.error(err));
  };

  // Nếu chưa xác thực xong thì không render gì cả
  if (!isAuthChecked) return null;

  return (
    <div className="w-full px-4 md:px-6 py-6 bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        📝 Nhập chỉ số sức khỏe theo tuần
      </h2>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
        onSubmit={handleSubmit}
      >
        {weeks.map((week) => (
          <Card key={week}>
            <CardContent>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                Tuần {week}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.name}>
                    {field.type === "double" ? (
                      <>
                        <div className="block text-gray-700 mb-1">{field.label}</div>
                        <div className="grid grid-cols-2 gap-2">
                          {field.subFields.map((sub) => {
                            const inputId = `week${week}-${field.name}-${sub.name}`;
                            return (
                              <div key={sub.name}>
                                <label htmlFor={inputId} className="sr-only">
                                  {field.label} {sub.label}
                                </label>
                                <Input
                                  id={inputId}
                                  type="number"
                                  placeholder={sub.label}
                                  value={data[week][field.name]?.[sub.name] || ""}
                                  onChange={(e) =>
                                    handleChange(week, field.name, {
                                      ...data[week][field.name],
                                      [sub.name]: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <>
                        <label htmlFor={`week${week}-${field.name}`} className="block text-gray-700 mb-1">
                          {field.label}
                        </label>
                        <Input
                          id={`week${week}-${field.name}`}
                          type={field.type}
                          step={field.step}
                          placeholder={field.placeholder || ""}
                          value={data[week][field.name] || ""}
                          onChange={(e) =>
                            handleChange(week, field.name, e.target.value)
                          }
                        />
                      </>
                    )}

                    {field.unit && (
                      <p className="text-xs text-gray-500 mt-1">
                        Đơn vị: {field.unit}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="text-right mt-4 md:col-span-2">
          <Button type="submit" className="px-6 py-2 text-lg cursor-pointer">
            Lưu thông tin
          </Button>
        </div>
      </form>
    </div>
  );
}