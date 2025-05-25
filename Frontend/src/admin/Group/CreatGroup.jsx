import { useState } from "react";
import { createGroup } from "../../api/groupApi";
import { useNavigate } from "react-router-dom";

export default function CreateGroup() {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleCreate = async () => {
        await createGroup({ name });
        navigate("/admin"); // hoặc reload danh sách
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Tạo nhóm bệnh</h2>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên nhóm bệnh"
                className="border p-2 mb-4 w-full"
            />
            <button
                onClick={handleCreate}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Tạo nhóm bệnh
            </button>
        </div>
    );
}
