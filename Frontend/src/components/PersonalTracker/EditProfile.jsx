import React, { useState, useEffect } from "react";

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
  });

  useEffect(() => {
    Promise.all([
      fetch(
        "http://localhost:3000/api/user/profile-test?userId=68144307237289e8d5982c9d",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((r) => r.json()), // User: email, name
      fetch(
        "http://localhost:3000/api/userinfo/test?userId=68144307237289e8d5982c9d",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((r) => {
        // Nếu 404 (UserInfo chưa tồn tại) → trả về {}
        if (r.status === 404) return {};
        return r.json();
      }),
    ])
      .then(([user, ui]) => {
        setFormData((prev) => ({
          ...prev,
          fullname: user.name || "",
          gender: ui.sex || "",
          dob: ui.birth_date ? ui.birth_date.slice(0, 10) : "",
          blood: ui.blood_type || "",
          height: ui.height || "",
          weight: ui.weight || "",
          diet: ui.diet_type || "",
          activity: ui.activity_level || "",
          lifestyle: ui.daily_routine || "",
        }));
      })
      .catch(console.error);
  }, []);

  const avatars = {
    male: "/src/assets/avatars/male_avatar.jpg",
    female: "/src/assets/avatars/female_avatar.jpg",
    other: "/src/assets/avatars/uit_avatar.png",
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const bodyUser = {
      name: formData.fullname,
    };

    const bodyInfo = {
      sex: formData.gender,
      birth_date: formData.dob,
      blood_type: formData.blood,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      diet_type: formData.diet,
      activity_level: formData.activity,
      daily_routine: formData.lifestyle,
    };

    fetch(
      "http://localhost:3000/api/user/profile",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        },
        body: JSON.stringify(bodyUser),
      }
    )
      .then((res) => res.text())
      .then((data) => console.log("Thành công " + data))
      .catch((err) => console.error(err));

    fetch(
      "http://localhost:3000/api/userinfo",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        },
        body: JSON.stringify(bodyInfo),
      }
    )
      .then((res) => res.text())
      .then((data) => console.log("Thành công " + data))
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 w-full bg-white dark:bg-white">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Chỉnh sửa profile
      </h2>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <img
          src={formData.gender === "female" ? avatars.female : avatars.male}
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
            value={formData.fullname}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="dob">Ngày sinh</Label>
          <Input
            id="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="gender">Giới tính</Label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div>
          <Label htmlFor="blood">Nhóm máu</Label>
          <select
            id="blood"
            value={formData.blood}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn --</option>
            {["A", "B", "AB", "O"].map((type) => (
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
            value={formData.height}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="weight">Cân nặng (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="condition">Tên bệnh nền</Label>
          <Input
            id="condition"
            value={formData.condition}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="diet">Chế độ ăn uống</Label>
          <select
            id="diet"
            value={formData.diet}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Chế độ ăn uống lành mạnh (Healthy Eating)</option>
            <option>Chế độ ăn uống theo nhóm máu (Blood Type Diet)</option>
            <option>Chế độ ăn uống theo nhóm cơ thể (Body Type Diet)</option>
            <option>Chế độ ăn uống theo nhóm tuổi (Age Group Diet)</option>
            <option>
              Chế độ ăn uống theo tình trạng sức khỏe (Health Condition Diet)
            </option>
            <option>Ít tinh bột (Low-Carb)</option>
            <option>Ít béo (Low-Fat)</option>
            <option>Ít cholesterol (Low-Cholesterol)</option>
            <option>Ít natri (Low-Sodium)</option>
            <option>Ít đường (Low-Sugar)</option>
            <option>Ít cholesterol (Low-Cholesterol)</option>
            <option>Ít calo (Low-Calorie)</option>
            <option>Ít chất béo (Low-Fat)</option>
            <option>Ít vitamin (Low-Vitamin)</option>
            <option>Ít khoáng chất (Low-Mineral)</option>
            <option>Ít omega-3 (Low-Omega-3)</option>
            <option>Ít chất chống oxy hóa (Low-Antioxidant)</option>
            <option>Ít probiotic (Low-Probiotic)</option>
            <option>Giàu protein (High-Protein)</option>
            <option>Giàu chất béo bão hòa (High-Saturated-Fat)</option>
            <option>Giàu chất xơ (High-Fiber)</option>
            <option>Giàu tinh bột (High-Carb)</option>
            <option>Giàu calo (High-Calorie)</option>
            <option>Giàu chất béo (High-Fat)</option>
            <option>Giàu vitamin (High-Vitamin)</option>
            <option>Giàu khoáng chất (High-Mineral)</option>
            <option>Giàu omega-3 (High-Omega-3)</option>
            <option>Giàu chất chống oxy hóa (High-Antioxidant)</option>
            <option>Giàu flavonoid (High-Flavonoid)</option>
            <option>Giàu probiotic (High-Probiotic)</option>
            <option>Keto (Ketogenic)</option>
            <option>Giảm cân (Weight Loss)</option>
            <option>Eat Clean</option>
            <option>Thực phẩm hữu cơ (Organic)</option>
            <option>Không chứa gluten (Gluten-Free)</option>
            <option>Cân bằng (Balanced)</option>
            <option>DASH (Phòng ngừa tăng huyết áp)</option>
            <option>Ăn chay (Vegetarian)</option>
            <option>Thuần chay (Vegan)</option>
            <option>Địa Trung Hải (Mediterranean)</option>
            <option>Thực dưỡng (Macrobiotic)</option>
            <option>Nhịn ăn gián đoạn (Intermittent Fasting)</option>
            <option>Thực phẩm chức năng (Supplements)</option>
            <option>Thực phẩm bổ sung (Nutritional Supplements)</option>
            <option>Khác</option>
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
              value={formData.conditionNote}
              onChange={handleChange}
            />
          </div>

          {/* Mức độ hoạt động và Sinh hoạt hằng ngày bên phải */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div>
              <Label htmlFor="activity">Mức độ hoạt động</Label>
              <select
                id="activity"
                value={formData.activity}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn --</option>
                <option value="low">Ít vận động</option>
                <option value="medium">Vận động vừa phải</option>
                <option value="high">Vận động thường xuyên</option>
                <option value="intense">Vận động mạnh</option>
              </select>
            </div>

            <div>
              <Label htmlFor="lifestyle">Sinh hoạt hằng ngày</Label>
              <select
                id="lifestyle"
                value={formData.lifestyle}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn --</option>
                <option value="ngủ đủ">Ngủ đủ giấc</option>
                <option value="hút thuốc">Hút thuốc</option>
                <option value="stress">Thường xuyên căng thẳng</option>
                <option value="làm việc nhiều">
                  Làm việc nhiều trên máy tính
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 text-right">
          <Button type="submit">Lưu thông tin</Button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
