import React, { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

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
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

const weeks = [1, 2, 3, 4];
const fields = [
  { label: "BMI", name: "bmi", unit: "" },
  { label: "Huyết áp", name: "blood_pressure", unit: "mmHg", placeholder: "VD: 120/80" },
  { label: "Nhịp tim", name: "heart_rate", unit: "bpm" },
  { label: "Đường huyết", name: "blood_glucose", unit: "mg/dL" },
  { label: "Tỷ lệ mỡ cơ thể", name: "body_fat", unit: "%" },
];

export default function WeeklyHealthInput() {
  const [data, setData] = useState({
    1: {}, 2: {}, 3: {}, 4: {},
  });

  const handleChange = (week, field, value) => {
    setData((prev) => ({
      ...prev,
      [week]: { ...prev[week], [field]: value },
    }));
  };

  const handleSubmit = () => {
    console.log("Dữ liệu 4 tuần:", data);
    // gửi dữ liệu lên server tại đây (axios/fetch)
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 w-full bg-white dark:bg-white">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        📝 Nhập chỉ số sức khỏe theo tuần
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weeks.map((week) => (
          <Card key={week} className="rounded-2xl shadow-md p-4">
            <CardContent>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                Tuần {week}
              </h3>
              <div className="space-y-3">
                {fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <Input
                      type="text"
                      placeholder={field.placeholder || ""}
                      value={data[week][field.name] || ""}
                      onChange={(e) =>
                        handleChange(week, field.name, e.target.value)
                      }
                      className="w-full"
                    />
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
      </div>

      <div className="text-center mt-8">
        <Button onClick={handleSubmit} className="px-6 py-2 text-lg">
          Lưu thông tin
        </Button>
      </div>
    </div>
  );
}
