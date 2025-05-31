import React, { useEffect, useState } from "react";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { li } from "framer-motion/client";

const apiBackendURL = import.meta.env.VITE_API_BACKEND;

const bmiData = [
  { week: "Tuần 1", bmi: 23 },
  { week: "Tuần 2", bmi: 22.8 },
  { week: "Tuần 3", bmi: 22.7 },
  { week: "Tuần 4", bmi: 22.5 },
];

const activityData = [
  { week: "Tuần 1", steps: 4000 },
  { week: "Tuần 2", steps: 5000 },
  { week: "Tuần 3", steps: 5500 },
  { week: "Tuần 4", steps: 6000 },
];

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-2">
    <span className="text-xl">{icon}</span>
    <h3 className="font-semibold text-blue-600 text-lg">{title}</h3>
  </div>
);

const headers = { "Content-Type": "application/json" };
const fmt = (d) => new Date(d).toLocaleDateString("vi-VN");

// -------------------------------------------------------------------------------------------

// Components
const PersonalInfoCard = () => {
  const [nameUser, setNameUser] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    Promise.all([
      fetch(`${apiBackendURL}/api/user`, {
        headers,
        credentials: "include",
      }).then((r) => r.json()),
      fetch(`${apiBackendURL}/api/userinfo`, {
        headers,
        credentials: "include",
      }).then((r) => (r.status === 404 ? {} : r.json())),
    ])
      .then(([u, ui]) => {
        setNameUser(u.name);
        setUserInfo((prev) => ({
          ...prev,
          ...ui,
        }));
      })
      .catch((err) => console.error(err));
  }, []);

  // if (!nameUser) return <div>Loading...</div>;

  const avatars = {
    male: "/src/assets/avatars/male_avatar.jpg",
    female: "/src/assets/avatars/female_avatar.jpg",
    other: "/src/assets/avatars/uit_avatar.png",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-black text-xl font-semibold">📋 Thông tin cá nhân</h2>
      <div className="flex flex-col md:flex-row items-stretch gap-8 bg-blue-50 rounded-2xl p-6 shadow-lg">
        {/* Phần trái */}
        <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left md:w-1/4">
          <img
            src={avatars[userInfo?.sex] || avatars.other}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover mb-3 border-4 border-blue-200"
          />
          <h2 className="text-2xl font-bold text-gray-700">{nameUser}</h2>
        </div>

        {/* Đường chia chính giữa chiều cao khối */}
        <div className="hidden md:flex justify-center">
          <div className="w-px bg-gray-500 h-full" />
        </div>

        {/* Phần phải */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm w-full md:w-3/4">
          {[
            ["Giới tính", userInfo?.sex],
            ["Ngày sinh", fmt(userInfo?.birth_date)],
            [
              "Tuổi",
              Math.floor(
                (Date.now() - new Date(userInfo?.birth_date)) /
                  (365.25 * 24 * 3600 * 1000)
              ),
            ],
            ["Nhóm máu", userInfo?.blood_type],
            ["Chiều cao", `${userInfo?.height} cm`],
            ["Cân nặng", `${userInfo?.weight} kg`],
            ["Đăng ký", userInfo?.updatedAt ? fmt(userInfo.updatedAt) : ""],
            ["Trạng thái", "Đang theo dõi"],
          ].map(([label, value], idx) => (
            <div key={idx}>
              <p className="text-gray-900">{label}</p>
              <p className="font-medium text-blue-900">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const RecentHealthMetrics = () => {
  const [healthMetric, setHealthMetric] = useState({});

  useEffect(() => {
    fetch(`${apiBackendURL}/api/health-metrics/me`, {
      headers,
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        setHealthMetric(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const metrics = [
    {
      label: "🩸 Huyết áp",
      value: healthMetric?.blood_pressure
        ? `${healthMetric?.blood_pressure.systolic}/${healthMetric?.blood_pressure.diastolic}`
        : "N/A",
      unit: "mmHg",
    },
    {
      label: "❤️ Nhịp tim",
      value: healthMetric?.heart_rate,
      unit: "bpm",
    },
    {
      label: "⚖️ BMI",
      value: healthMetric?.bmi,
      unit: "",
    },
    {
      label: "🍬 Đường huyết",
      value: healthMetric?.blood_glucose,
      unit: "mg/dL",
    },
    {
      label: "💪 Tỷ lệ mỡ cơ thể",
      value: healthMetric?.body_fat_percentage,
      unit: "%",
    },
    {
      label: "🧪 Cholesterol",
      value: [
        [`LDL: `, `${healthMetric?.cholesterol_ldl}`],
        [`HDL: `, `${healthMetric?.cholesterol_hdl}`],
      ],
      unit: "mg/dL",
    },
    {
      label: "🧫 Men gan",
      value: [
        [`SGPT: `, `${healthMetric?.liver_enzymes?.sgpt}`],
        [`SGOT: `, `${healthMetric?.liver_enzymes?.sgot}`],
      ],
      unit: "U/L",
    },
    // {
    //   label: "💧 Nước tiểu",
    //   value: healthMetric?.urine,
    //   unit: "",
    // },
    {
      label: "📉 Chỉ số thận",
      value: [
        [`Creatinine: `, `${healthMetric?.kidney?.creatinine}`],
        [`eGFR: `, `${healthMetric?.kidney?.egfr}`],
      ],
      unit: ["mg/dL", "mL/min/1.73m²"], // Vì mỗi chỉ số đã có đơn vị riêng
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-black text-xl font-semibold">📈 Chỉ số sức khỏe</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {metrics.map((item, idx) => (
          <Card
            key={idx}
            className="text-center hover:shadow-xl transition p-4"
          >
            <p className="text-blue-600 font-medium">{item.label}</p>
            <div className="mt-2 text-2xl font-bold text-gray-700">
              {Array.isArray(item.value) ? (
                <>
                  {item.value.map((val, i) => (
                    <p key={i}>
                      <span className="text-sm text-gray-700 space-y-1">
                        {val[0]}
                      </span>
                      {val[1]}{" "}
                      <span className="text-gray-500 text-base font-normal">
                        {Array.isArray(item.unit) ? item.unit[i] : item.unit}
                      </span>
                    </p>
                  ))}
                </>
              ) : (
                <>
                  {item.value}{" "}
                  <span className="text-base font-normal text-gray-500">
                    {item.unit}
                  </span>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

const MedicalInfoSection = () => {
  const [medicalHistory, setMedicalHistory] = useState({});
  const [prescription, setPrescription] = useState({});
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    Promise.all([
      fetch(`${apiBackendURL}/api/medical-history/me`, {
        headers,
        credentials: "include",
      }).then((r) => r.json()),
      fetch(`${apiBackendURL}/api/prescriptions/me`, {
        headers,
        credentials: "include",
      }).then((r) => r.json()),
      fetch(`${apiBackendURL}/api/userinfo`, {
        headers,
        credentials: "include",
      }).then((r) => r.json()),
    ])
      .then(([a, b, c]) => {
        setMedicalHistory(a);
        setPrescription(b);
        setUserInfo(c);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <Card>
        <SectionTitle icon="🩺" title="Bệnh nền" />
        <ul className="list-disc list-inside text-gray-700">
          {/* {medicalHistory.map((value, index) => (
            <li key={index}>
              {value.disease_name}
              {" - "}
              {value.notes}
            </li>
          ))} */}

          <li>
            {medicalHistory?.disease_name}
            {" - "}
            {medicalHistory?.notes}
          </li>
        </ul>
      </Card>
      <Card>
        <SectionTitle icon="💊" title="Thuốc đã dùng" />
        <ul className="list-disc list-inside text-gray-700">
          {/* {prescription.map((value) =>
            value.meds.map((drug, index) => <li key={index}>{drug.name}</li>)
          )} */}
        </ul>
      </Card>
      <Card>
        <SectionTitle icon="🥗" title="Chế độ ăn uống" />
        <ul className="list-disc list-inside text-gray-700">
          <li>{userInfo?.diet_type}</li>
        </ul>
      </Card>
      <Card>
        <SectionTitle icon="🏃" title="Thói quen sinh hoạt" />

        <ul className="list-disc list-inside text-gray-700">
          <li>
            {userInfo?.daily_routine}
            {" - "}
            {userInfo?.activity_level}
          </li>
        </ul>
      </Card>
    </motion.div>
  );
};

const HealthTrendsCharts = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6, duration: 0.5 }}
    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
  >
    <Card>
      <SectionTitle icon="📊" title="BMI theo tuần" />
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={bmiData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis domain={[20, 25]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="bmi"
            stroke="#3B82F6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
    <Card>
      <SectionTitle icon="🚶‍♂️" title="Bước chân theo tuần" />
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={activityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="steps" fill="#60A5FA" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <PersonalInfoCard />
      <RecentHealthMetrics />
      <MedicalInfoSection />
      <HealthTrendsCharts />
    </div>
  );
};

export default Dashboard;
