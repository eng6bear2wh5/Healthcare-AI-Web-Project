import React, { useState } from 'react';

function InputForm({
  height, setHeight,
  weight, setWeight,
  diseases, setDiseases,
  medications, setMedications,
  diet, setDiet,
  image, setImage
}) {
  const [newMed, setNewMed] = useState('');

  // Xử lý checkbox bệnh nền
  const handleDiseaseChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      // Thêm vào mảng nếu được chọn
      setDiseases([...diseases, value]);
    } else {
      // Loại bỏ khỏi mảng nếu bỏ chọn
      setDiseases(diseases.filter(d => d !== value));
    }
  };

  // Thêm thuốc mới vào danh sách
  const addMedication = () => {
    if (newMed.trim() !== '') {
      setMedications([...medications, newMed.trim()]);
      setNewMed('');
    }
  };

  // Xóa thuốc khỏi danh sách
  const removeMedication = (med) => {
    setMedications(medications.filter(m => m !== med));
  };

  // Xử lý upload ảnh
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tạo URL để hiển thị preview ảnh
      setImage(URL.createObjectURL(file));
    }
  };

  // Ngăn form submit (chỉ cần input tự động cập nhật)
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Chiều cao */}
      <div>
        <label className="block font-medium">Height (cm):</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          placeholder="Nhập chiều cao"
        />
      </div>

      {/* Cân nặng */}
      <div>
        <label className="block font-medium">Weight (kg):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          placeholder="Nhập cân nặng"
        />
      </div>

      {/* Bệnh nền */}
      <div>
        <label className="block font-medium">Underlying Diseases:</label>
        <div className="flex flex-wrap gap-4 mt-2">
          {["Diabetes", "Hypertension", "Asthma", "Heart Disease"].map((d) => (
            <label key={d} className="flex items-center">
              <input
                type="checkbox"
                value={d}
                checked={diseases.includes(d)}
                onChange={handleDiseaseChange}
                className="mr-1"
              />
              {d}
            </label>
          ))}
        </div>
      </div>

      {/* Thuốc đã uống */}
      <div>
        <label className="block font-medium">Medications:</label>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newMed}
            onChange={(e) => setNewMed(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
            placeholder="Nhập tên thuốc"
          />
          <button
            type="button"
            onClick={addMedication}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Add
          </button>
        </div>
        {/* Danh sách thuốc đã thêm */}
        <ul className="list-disc ml-5 mt-2">
          {medications.map((m, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <span>{m}</span>
              <button
                type="button"
                onClick={() => removeMedication(m)}
                className="text-red-500 hover:underline ml-2"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chế độ ăn */}
      <div>
        <label className="block font-medium">Diet Plan:</label>
        <textarea
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          className="border rounded px-2 py-1 w-full mt-2"
          rows="3"
          placeholder="Mô tả chế độ ăn uống"
        />
      </div>

      {/* Upload ảnh triệu chứng */}
      <div>
        <label className="block font-medium">Upload Symptom Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-2"
        />
        {image && (
          <img
            src={image}
            alt="Symptom"
            className="mt-4 h-32 object-cover border rounded"
          />
        )}
      </div>
    </form>
  );
}

export default InputForm;
