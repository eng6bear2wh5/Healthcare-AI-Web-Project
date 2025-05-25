import React, { useState } from "react";

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

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ví dụ gửi đến backend:
    const dataToSend = new FormData();
    for (let key in formData) {
      dataToSend.append(key, formData[key]);
    }
    if (avatar) {
      dataToSend.append("avatar", avatar);
    }

    // fetch("/api/update-profile", {
    //   method: "POST",
    //   body: dataToSend,
    // });

    console.log("Submitting form data:", formData);
    if (avatar) console.log("Avatar file:", avatar.name);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 w-full bg-white dark:bg-white">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Chỉnh sửa profile
      </h2>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            No avatar
          </div>
        )}
        <div>
          <Label htmlFor="avatar">Ảnh đại diện</Label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="fullname">Họ tên</Label>
          <Input id="fullname" value={formData.fullname} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="dob">Ngày sinh</Label>
          <Input id="dob" type="date" value={formData.dob} onChange={handleChange} />
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
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="height">Chiều cao (cm)</Label>
          <Input id="height" type="number" value={formData.height} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="weight">Cân nặng (kg)</Label>
          <Input id="weight" type="number" value={formData.weight} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="condition">Tên bệnh nền</Label>
          <Input id="condition" value={formData.condition} onChange={handleChange} />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="conditionNote">Ghi chú</Label>
          <Textarea
            id="conditionNote"
            rows="3"
            value={formData.conditionNote}
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
            <option value="">-- Chọn --</option>
            <option value="healthy">Healthy Eating</option>
            <option value="low-carb">Low-Carb</option>
            <option value="low-fat">Low-Fat</option>
            <option value="balanced">Balanced</option>
            <option value="vegan">Vegan</option>
            <option value="keto">Ketogenic</option>
            <option value="other">Khác</option>
          </select>
        </div>

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
            <option value="làm việc nhiều">Làm việc nhiều trên máy tính</option>
          </select>
        </div>

        <div className="md:col-span-2 text-right">
          <Button type="submit">Lưu thông tin</Button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
