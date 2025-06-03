import React, { useState, useEffect } from "react";
import { useToast } from "../ToastContext";
import { useNavigate } from "react-router-dom";

let hasShownAuthAlert = false; 

function useAuthFetch() {
<<<<<<< HEAD
=======
  const { showToast } = useToast();
>>>>>>> a03675c (add elastic remote and AI chatbot)
  const navigate = useNavigate();
  return async (...args) => {
    const res = await fetch(...args);
    if (res.status === 401) {
      if (!hasShownAuthAlert) {
        hasShownAuthAlert = true;
<<<<<<< HEAD
        alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để sử dụng chức năng này!");
=======
        showToast("Bạn chưa đăng nhập! Vui lòng đăng nhập để sử dụng chức năng này!", "fail");
>>>>>>> a03675c (add elastic remote and AI chatbot)
        navigate("/", { replace: true });
      }
      throw new Error("Unauthorized");
    }
    return res;
  };
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`border px-3 w-full py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`border px-3 py-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
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

function Label({ htmlFor, children, className = "" }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
    </label>
  );
}

function EditProfile() {
  useEffect(() => {
    document.title = "PersonalTracker | HealthTrust";
  }, []);
  
  const [formData, setFormData] = useState({
    fullname: "",
    dob: "",
    gender: "",
    blood: "",
    height: "",
    weight: "",
    condition: "",
    conditionNote: "",
    diet: "",
    activity: "",
    lifestyle: "",
    drugs: "",
  });
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const { showToast } = useToast();

  const apiBackendURL = import.meta.env.VITE_API_BACKEND;
  const authFetch = useAuthFetch();
  const [userId, setUserId] = useState("");

  const avatarKey =
    formData.gender === "Nam"
      ? "male"
      : formData.gender === "Nữ"
      ? "female"
      : "other";

  useEffect(() => {
    Promise.all([
      authFetch(`${apiBackendURL}/api/user`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }).then((r) => r.json()),
      authFetch(`${apiBackendURL}/api/userinfo`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }).then((r) => {
        if (r.status === 404) return {};
        return r.json();
      }),
      authFetch(`${apiBackendURL}/api/medical-history/me`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }).then((r) => {
        if (r.status === 404) return {};
        return r.json();
      }),
    ])
      .then(([user, ui, medical_history]) => {
        setUserId(user._id || "");
        setFormData((prev) => ({
          ...prev,
          fullname: user.name || "",
          gender:
            ui.sex === "male"
              ? "Nam"
              : ui.sex === "female"
              ? "Nữ"
              : ui.sex === "other"
              ? "Khác"
              : "",
          dob: ui.birth_date ? ui.birth_date.slice(0, 10) : "",
          blood: ui.blood_type || "",
          height: ui.height || "",
          weight: ui.weight || "",
          diet: ui.diet_type || "",
          activity: ui.activity_level || "",
          lifestyle: ui.daily_routine || "",
          condition: medical_history?.disease_name || "",
          conditionNote: medical_history?.notes || "",
          drugs: medical_history?.drugs || "",
        }));
        setIsAuthChecked(true); // Chỉ render khi đã xác thực xong
      })
      .catch((err) => {
        // Nếu bị 401 thì đã navigate rồi, không cần setIsAuthChecked
      });
  }, []);

  const avatars = {
    male: "/avatars/male_avatar.jpg",
    female: "/avatars/female_avatar.jpg",
    other: "/avatars/uit_avatar.png",
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId) {
      showToast("Không xác định được user. Vui lòng thử lại!", "error");
      return;
    }

    const bodyUser = {
      name: formData?.fullname,
    };

    const bodyInfo = {
      sex:
        formData?.gender === "Nam"
          ? "male"
          : formData?.gender === "Nữ"
          ? "female"
          : "other",
      birth_date: formData?.dob,
      blood_type: formData?.blood,
      height: formData?.height ? parseFloat(formData.height) : "",
      weight: formData?.weight ? parseFloat(formData.weight) : "",
      diet_type: formData?.diet,
      activity_level: formData?.activity,
      daily_routine: formData?.lifestyle,
    };

    const bodyMedicalHistory = {
      user_id: userId, // BỔ SUNG DÒNG NÀY
      disease_name: formData?.condition,
      diagnosis_date: new Date().toISOString(), // chuyển sang chuỗi ISO
      notes: formData?.conditionNote,
      drugs: formData?.drugs,
    };

    console.log("bodyUser:", bodyUser);
    console.log("bodyInfo:", bodyInfo);
    console.log("bodyMedicalHistory:", bodyMedicalHistory);
    
    Promise.all([
      authFetch(`${apiBackendURL}/api/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyUser),
      }),
      authFetch(`${apiBackendURL}/api/userinfo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyInfo),
      }),
      authFetch(`${apiBackendURL}/api/medical-history`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyMedicalHistory),
      }),
    ])
      .then((responses) => {
        // Kiểm tra tất cả đều thành công
        if (responses.every((res) => res.ok)) {
          showToast("Đã cập nhập profile!", "success");
        } else {
          throw new Error("Có lỗi khi cập nhật thông tin!");
        }
      })
      .catch((err) => {
        console.error(err);
        showToast("Cập nhật thông tin thất bại!", "error");
      });
    showToast("Đã cập nhập profile!", "success");
  };

  // Chỉ render khi đã xác thực xong
  if (!isAuthChecked) return null;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 w-full bg-white dark:bg-white">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Chỉnh sửa profile
      </h2>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <img
          src={avatars[avatarKey]}
          alt="Avatar Preview"
          className="w-24 h-24 rounded-full object-cover border"
        />

        <div>
          <Label htmlFor="avatar">Ảnh đại diện</Label>
          {/* <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
          /> */}
        </div>
      </div>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        <div>
          <Label htmlFor="fullname">Họ tên</Label>
          <Input
            id="fullname"
            value={formData?.fullname}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="dob">Ngày sinh</Label>
          <Input
            id="dob"
            type="date"
            value={formData?.dob}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="gender">Giới tính</Label>
          <select
            id="gender"
            value={formData?.gender}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {!formData.gender && <option value="">-- Chọn --</option>}
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div>
          <Label htmlFor="blood">Nhóm máu</Label>
          <select
            id="blood"
            value={formData?.blood}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn --</option>
            {["A", "B", "AB", "O", "A-", "B-", "AB-", "O-", "other"].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="height">Chiều cao (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData?.height}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="weight">Cân nặng (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData?.weight}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="condition">Tên bệnh nền</Label>
          <Input
            id="condition"
            value={formData?.condition}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="diet">Chế độ ăn uống</Label>
          <select
            id="diet"
            value={formData?.diet}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[
              "Chế độ ăn uống lành mạnh (Healthy Eating)",
              "Chế độ ăn uống theo nhóm máu (Blood Type Diet)",
              "Chế độ ăn uống theo nhóm cơ thể (Body Type Diet)",
              "Chế độ ăn uống theo nhóm tuổi (Age Group Diet)",
              "Chế độ ăn uống theo tình trạng sức khỏe (Health Condition Diet)",
              "Ít tinh bột (Low-Carb)",
              "Ít béo (Low-Fat)",
              "Ít cholesterol (Low-Cholesterol)",
              "Ít natri (Low-Sodium)",
              "Ít đường (Low-Sugar)",
              "Ít calo (Low-Calorie)",
              "Ít vitamin (Low-Vitamin)",
              "Ít khoáng chất (Low-Mineral)",
              "Ít omega-3 (Low-Omega-3)",
              "Ít chất chống oxy hóa (Low-Antioxidant)",
              "Ít probiotic (Low-Probiotic)",
              "Giàu protein (High-Protein)",
              "Giàu chất béo bão hòa (High-Saturated-Fat)",
              "Giàu chất xơ (High-Fiber)",
              "Giàu tinh bột (High-Carb)",
              "Giàu calo (High-Calorie)",
              "Giàu chất béo (High-Fat)",
              "Giàu vitamin (High-Vitamin)",
              "Giàu khoáng chất (High-Mineral)",
              "Giàu omega-3 (High-Omega-3)",
              "Giàu chất chống oxy hóa (High-Antioxidant)",
              "Giàu flavonoid (High-Flavonoid)",
              "Giàu probiotic (High-Probiotic)",
              "Keto (Ketogenic)",
              "Giảm cân (Weight Loss)",
              "Eat Clean",
              "Thực phẩm hữu cơ (Organic)",
              "Không chứa gluten (Gluten-Free)",
              "Cân bằng (Balanced)",
              "DASH (Phòng ngừa tăng huyết áp)",
              "Ăn chay (Vegetarian)",
              "Thuần chay (Vegan)",
              "Địa Trung Hải (Mediterranean)",
              "Thực dưỡng (Macrobiotic)",
              "Nhịn ăn gián đoạn (Intermittent Fasting)",
              "Thực phẩm chức năng (Supplements)",
              "Thực phẩm bổ sung (Nutritional Supplements)",
              "Khác",
            ].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Ghi chú và Hoạt động + Sinh hoạt: chiếm toàn bộ chiều rộng form */}
        <div className="md:col-span-2 flex flex-col md:flex-row gap-6">
          {/* Ghi chú bên trái */}
          <div className="w-full md:w-1/2 flex flex-col">
            <Label htmlFor="conditionNote">Ghi chú bệnh nền</Label>
            <Textarea
              id="conditionNote"
              rows={6}
              className="h-full min-h-[150px] flex-grow"
              value={formData?.conditionNote}
              onChange={handleChange}
            />
          </div>

          {/* Mức độ hoạt động và Sinh hoạt hằng ngày bên phải */}
          <div className="w-full md:w-1/2 flex flex-col">
            <Label htmlFor="drugs">
              Các loại thuốc đã dùng (nếu có)
            </Label>
            <Textarea
              id="drugs"
              rows={6}
              className="h-full min-h-[150px] flex-grow"
              value={formData?.drugs}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="activity">Mức độ hoạt động</Label>
          <select
            id="activity"
            value={formData?.activity}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn --</option>
            <option value="Ít vận động">Ít vận động</option>
            <option value="Vận động vừa phải">Vận động vừa phải</option>
            <option value="Vận động thường xuyên">Vận động thường xuyên</option>
            <option value="Vận động mạnh">Vận động mạnh</option>
          </select>
        </div>

        <div>
          <Label htmlFor="lifestyle">Sinh hoạt hằng ngày</Label>
          <select
            id="lifestyle"
            value={formData?.lifestyle}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn --</option>
            <option value="Ngủ đủ giấc">Ngủ đủ giấc</option>
            <option value="Ngủ không đủ giấc">Ngủ không đủ giấc</option>
            <option value="Hút thuốc">Hút thuốc</option>
            <option value="Uống rượu bia">Uống rượu bia</option>
            <option value="Thường xuyên căng thẳng">
              Thường xuyên căng thẳng
            </option>
            <option value="Làm việc nhiều trên máy tính">
              Làm việc nhiều trên máy tính
            </option>
            <option value="Lười vận động">Lười vận động</option>
            <option value="Tập thể dục đều đặn">Tập thể dục đều đặn</option>
            <option value="Thức khuya thường xuyên">
              Thức khuya thường xuyên
            </option>
            <option value="Ăn uống không điều độ">Ăn uống không điều độ</option>
            <option value="Ăn khuya">Ăn khuya</option>
            <option value="Thường xuyên đi du lịch">
              Thường xuyên đi du lịch
            </option>
            <option value="Thường xuyên tiếp xúc với thiết bị điện tử">
              Thường xuyên tiếp xúc với thiết bị điện tử
            </option>
            <option value="Sinh hoạt theo giờ giấc ổn định">
              Sinh hoạt theo giờ giấc ổn định
            </option>
            <option value="Thiền hoặc tập yoga">Thiền hoặc tập yoga</option>
            <option value="Làm việc ca đêm">Làm việc ca đêm</option>
            <option value="Thường xuyên ăn đồ ăn nhanh">
              Thường xuyên ăn đồ ăn nhanh
            </option>
            <option value="Uống đủ nước mỗi ngày">Uống đủ nước mỗi ngày</option>
            <option value="Không ăn sáng">Không ăn sáng</option>
            <option value="Tự chăm sóc sức khỏe tốt">
              Tự chăm sóc sức khỏe tốt
            </option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div className="md:col-span-2 text-right">
          <Button type="submit" className="cursor-pointer">Lưu thông tin</Button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;