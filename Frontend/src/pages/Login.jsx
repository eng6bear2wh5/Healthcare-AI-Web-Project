import { useEffect } from "react";

export default function Login() {
    useEffect(() => {
        document.title = "Đăng nhập | HealthTrust";
    }, []);
    return (
        <div className="flex justify-center items-center h-96">
            <div className="border p-6 rounded shadow w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>
                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    className="w-full p-2 mb-3 border rounded"
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-full p-2 mb-4 border rounded"
                />
                <button className="w-full bg-blue-600 text-white py-2 rounded">Đăng nhập</button>
            </div>
        </div>
    );
}