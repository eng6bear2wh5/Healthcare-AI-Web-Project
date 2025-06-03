import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  //ComposedChart, // Do không dùng đến nên tạm thời không import nó vô
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
//import { li } from "framer-motion/client"; do không có dùng đến nên tạm thời không import

import { useToast } from "../ToastContext"; // chỉnh đúng path


const apiBackendURL = import.meta.env.VITE_API_BACKEND;
let hasShownAuthAlert = false; // Đặt ngoài component

function useAuthFetch() {

  const { showToast } = useToast();

  const navigate = useNavigate();
  return async (...args) => {
    const res = await fetch(...args);
    if (res.status === 401) {
      if (!hasShownAuthAlert) {
        hasShownAuthAlert = true;
        showToast("Bạn chưa đăng nhập! Vui lòng đăng nhập để sử dụng chức năng này!", "fail");
        navigate("/", { replace: true });
      }
      throw new Error("Unauthorized");
    }
    return res;
  };
}

// const bmiData = [
//   { week: "Tuần 1", bmi: 23 },
//   { week: "Tuần 2", bmi: 22.8 },
//   { week: "Tuần 3", bmi: 22.7 },
//   { week: "Tuần 4", bmi: 22.5 },
// ];

// const activityData = [
//   { week: "Tuần 1", steps: 4000 },
//   { week: "Tuần 2", steps: 5000 },
//   { week: "Tuần 3", steps: 5500 },
//   { week: "Tuần 4", steps: 6000 },
// ];

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
  const authFetch = useAuthFetch();

  useEffect(() => {
    Promise.all([
      authFetch(`${apiBackendURL}/api/user`, {
        headers,
        credentials: "include",
      }).then((r) => r.json()),
      authFetch(`${apiBackendURL}/api/userinfo`, {
        headers,
        credentials: "include",
      }).then((r) => (r.status === 404 ? {} : r.json())),
    ])
      .then(([u, ui]) => {
        setNameUser(u.name);
        setUserInfo((prev) => ({
          ...prev,
          ...ui,
          sex:
            ui.sex === "male"
              ? "male"
              : ui.sex === "female"
              ? "female"
              : "other",
        }));
      })
      .catch((err) => console.error(err));
  }, []);

  // if (!nameUser){}

  const avatars = {
    male: "/avatars/male_avatar.jpg",
    female: "/avatars/female_avatar.jpg",
    other: "/avatars/uit_avatar.png",
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
            ["Giới tính", userInfo?.sex === "male" ? "Nam" : userInfo?.sex === "female" ? "Nữ" : "Khác"],
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
  // const [healthMetric, setHealthMetric] = useState({});
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch();

  // Hàm tính trung bình
  function calcAvg(arr, key) {
    const valid = arr.map(item => item?.[key]).filter(v => typeof v === "number" && !isNaN(v));
    if (!valid.length) return null;
    return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length); // làm tròn số nguyên
  }
  
  function calcAvgBloodPressure(arr) {
    const valid = arr.map(item => item?.blood_pressure).filter(Boolean);
    if (!valid.length) return null;
    const avgSys = Math.round(valid.reduce((a, b) => a + b.systolic, 0) / valid.length);
    const avgDia = Math.round(valid.reduce((a, b) => a + b.diastolic, 0) / valid.length);
    return `${avgSys}/${avgDia}`;
  }

  useEffect(() => {
    authFetch(`${apiBackendURL}/api/health-metrics/me`, {
      headers,
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        setWeeklyData(data?.weekly_data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const avgMetrics = [
    {
      label: "🩸 Huyết áp",
      value: calcAvgBloodPressure(weeklyData) || "N/A",
      unit: "mmHg",
    },
    {
      label: "❤️ Nhịp tim",
      value: calcAvg(weeklyData, "heart_rate") ?? "N/A",
      unit: "bpm",
    },
    {
      label: "⚖️ BMI",
      value: calcAvg(weeklyData, "bmi") ?? "N/A",
      unit: "",
    },
    {
      label: "🍬 Đường huyết",
      value: calcAvg(weeklyData, "blood_glucose") ?? "N/A",
      unit: "mg/dL",
    },
    {
      label: "💪 Tỷ lệ mỡ cơ thể",
      value: calcAvg(weeklyData, "body_fat") ?? "N/A",
      unit: "%",
    },
    {
      label: "🧪 Cholesterol",
      value: [
        [
          "LDL: ",
          calcAvg(
            weeklyData.map(item => ({
              ldl: item?.cholesterol?.ldl
            })),
            "ldl"
          ) ?? "N/A"
        ],
        [
          "HDL: ",
          calcAvg(
            weeklyData.map(item => ({
              hdl: item?.cholesterol?.hdl
            })),
            "hdl"
          ) ?? "N/A"
        ],
      ],
      unit: "mg/dL",
    },
    {
      label: "🧫 Men gan",
      value: [
        [
          "SGPT: ",
          calcAvg(
            weeklyData.map(item => ({
              sgpt: item?.liver_enzymes?.sgpt
            })),
            "sgpt"
          ) ?? "N/A"
        ],
        [
          "SGOT: ",
          calcAvg(
            weeklyData.map(item => ({
              sgot: item?.liver_enzymes?.sgot
            })),
            "sgot"
          ) ?? "N/A"
        ],
      ],
      unit: "U/L",
    },
    {
      label: "📉 Chỉ số thận",
      value: [
        [
          "Creatinine: ",
          calcAvg(
            weeklyData.map(item => ({
              creatinine: item?.kidney_index?.creatinine
            })),
            "creatinine"
          ) ?? "N/A"
        ],
        [
          "eGFR: ",
          calcAvg(
            weeklyData.map(item => ({
              eGFR: item?.kidney_index?.eGFR
            })),
            "eGFR"
          ) ?? "N/A"
        ],
      ],
      unit: ["mg/dL", "mL/min/1.73m²"],
    },
  ];

  if (loading) {
    // Skeleton giữ chỗ cho 8 card
    return (
      <div>
        <h2 className="text-black text-xl font-semibold mb-4">📈 Chỉ số sức khỏe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse h-32 flex flex-col items-center justify-center">
              <div className="h-5 w-1/2 bg-gray-200 rounded mb-3"></div>
              <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-black text-xl font-semibold mb-4">📈 Chỉ số sức khỏe</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {avgMetrics.map((item, idx) => (
          <Card
            key={idx}
            className="text-center hover:shadow-xl transition p-4 flex flex-col justify-center items-center"
          >
            <p className="text-blue-600 font-medium mb-2">{item.label}</p>
            <div className="mt-2 text-2xl font-bold text-gray-700">
              {Array.isArray(item.value) ? (
                <div className="space-y-1">
                  {item.value.map((val, i) => (
                    <div key={i} className="flex items-baseline justify-center gap-1">
                      <span className="text-sm text-gray-700">{val[0]}</span>
                      <span>{val[1]}</span>
                      <span className="text-gray-500 text-base font-normal ml-1">
                        {Array.isArray(item.unit) ? item.unit[i] : item.unit}
                      </span>
                    </div>
                  ))}
                </div>
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
}


const MedicalInfoSection = () => {
  const [medicalHistory, setMedicalHistory] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      authFetch(`${apiBackendURL}/api/medical-history/me`, {
        headers,
        credentials: "include",
      }).then((r) => r.json()),
      authFetch(`${apiBackendURL}/api/userinfo`, {
        headers,
        credentials: "include",
      }).then((r) => r.json()),
    ])
      .then(([a, b]) => {
        setMedicalHistory(a);
        setUserInfo(b);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err)
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse h-40"></div>
        ))}
      </div>
    );
  }

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
          <li>{medicalHistory?.drugs}</li>
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

const HealthTrendsCharts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch();

  useEffect(() => {
    authFetch(`${apiBackendURL}/api/health-metrics/me`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res?.weekly_data)) {
          const sorted = res.weekly_data
            .sort((a, b) => a.week - b.week)
            .map((d) => ({
              week: `Tuần ${d.week}`,
              bmi: d.bmi ?? null,
              glucose: d.blood_glucose ?? null,
              systolic: d.blood_pressure?.systolic ?? null,
              diastolic: d.blood_pressure?.diastolic ?? null,
              body_fat: d.body_fat ?? null,
            }));
          setData(sorted);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // if (loading) {
  //   return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;
  // }
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse h-[320px]"></div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* BMI */}
      <Card>
        <SectionTitle icon="📊" title="BMI theo tuần" />
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
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

      {/* Huyết áp */}
      <Card>
        <SectionTitle icon="🩸" title="Huyết áp (Tâm thu & trương)" />
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="systolic"
              stroke="#EF4444"
              strokeWidth={2}
              name="Tâm thu"
            />
            <Line
              type="monotone"
              dataKey="diastolic"
              stroke="#F59E0B"
              strokeWidth={2}
              name="Tâm trương"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Đường huyết */}
      <Card>
        <SectionTitle icon="🍬" title="Đường huyết theo tuần" />
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="glucose" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Tỷ lệ mỡ cơ thể */}
      <Card>
        <SectionTitle icon="⚖️" title="Tỷ lệ mỡ cơ thể theo tuần" />
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis unit="%" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="body_fat"
              stroke="#6366F1"
              fill="#A5B4FC"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};

// -------------------------------------------------------------------------------------------

const Dashboard = () => {
  useEffect(() => {
    document.title = "PersonalTracker | HealthTrust";
  }, []);
  
  // Thêm state kiểm tra xác thực
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const { showToast } = useToast();
  // Kiểm tra đăng nhập 1 lần duy nhất khi vào Dashboard
  useEffect(() => {
    fetch(`${apiBackendURL}/api/user`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          if (!hasShownAuthAlert) {
            hasShownAuthAlert = true;
            showToast("Bạn chưa đăng nhập! Vui lòng đăng nhập để sử dụng chức năng này!", "fail");
            window.location.href = "/";
          }
          setIsAuthChecked(false);
        } else {
          setIsAuthChecked(true);
        }
      })
      .catch(() => setIsAuthChecked(false));
  }, []);

  // Nếu chưa xác thực xong thì không render gì cả
  if (!isAuthChecked) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 min-h-[1600px]">
      <PersonalInfoCard />
      <RecentHealthMetrics />
      <MedicalInfoSection />
      <HealthTrendsCharts />
    </div>
  );
};

export default Dashboard;