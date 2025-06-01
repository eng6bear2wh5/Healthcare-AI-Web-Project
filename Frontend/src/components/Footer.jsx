export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-600 text-sm">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Copyright */}
                <p className="text-center md:text-left">
                    © 2025 Study For You. All rights reserved.
                </p>

                {/* Các liên kết (tuỳ chọn) */}
                <div className="flex gap-4">
                    <a href="#" className="hover:text-blue-500 transition px-3 py-2 min-w-[48px] min-h-[48px] flex items-center justify-center rounded">
                        Chính sách
                    </a>
                    <a href="#" className="hover:text-blue-500 transition px-3 py-2 min-w-[48px] min-h-[48px] flex items-center justify-center rounded">
                        Điều khoản
                    </a>
                    <a href="#" className="hover:text-blue-500 transition px-3 py-2 min-w-[48px] min-h-[48px] flex items-center justify-center rounded">
                        Liên hệ
                    </a>
                </div>
            </div>
        </footer>
    );
}
