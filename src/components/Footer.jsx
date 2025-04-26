export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-600 text-sm mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Copyright */}
                <p className="text-center md:text-left">
                    © 2025 Study For You. All rights reserved.
                </p>

                {/* Các liên kết (tuỳ chọn) */}
                <div className="flex gap-4">
                    <a href="#" className="hover:text-blue-500 transition">
                        Chính sách
                    </a>
                    <a href="#" className="hover:text-blue-500 transition">
                        Điều khoản
                    </a>
                    <a href="#" className="hover:text-blue-500 transition">
                        Liên hệ
                    </a>
                </div>
            </div>
        </footer>
    );
}
