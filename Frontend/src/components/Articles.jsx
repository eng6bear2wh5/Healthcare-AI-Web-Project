import { useState } from "react";

export default function Articles() {
    const [activeTab, setActiveTab] = useState("featured");

    const articles = Array.from({ length: 10 }, (_, i) => ({
        title: `Bài viết ${i + 1}`,
        content: `Nội dung tóm tắt của bài viết số ${i + 1}. Đây là một đoạn mô tả ngắn giúp người đọc hiểu sơ lược về nội dung chính.`,
        image: `https://via.placeholder.com/400x200?text=Image+${i + 1}`,
    }));

    const latestArticles = Array.from({ length: 5 }, (_, i) => ({
        title: `Bài viết mới ${i + 1}`,
        content: `Đây là một bài viết mới, cung cấp thông tin mới nhất về các chủ đề sức khỏe.`,
        image: `https://via.placeholder.com/400x200?text=Latest+${i + 1}`,
    }));

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            {/* Tabs */}
            <div className="flex gap-6 mb-8">
                <button
                    onClick={() => setActiveTab("featured")}
                    className={`text-xl font-semibold pb-2 border-b-2 ${activeTab === "featured"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-blue-600"
                        } transition`}
                >
                    Bài viết nổi bật
                </button>
                <button
                    onClick={() => setActiveTab("latest")}
                    className={`text-xl font-semibold pb-2 border-b-2 ${activeTab === "latest"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-blue-600"
                        } transition`}
                >
                    Bài viết mới nhất
                </button>
            </div>

            {/* Nội dung */}
            {activeTab === "featured" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.slice(0, 6).map((a, i) => (
                        <div
                            key={i}
                            className={`rounded-lg shadow-md p-5 bg-white hover:shadow-lg transition ${i === 0 ? "lg:col-span-2" : ""
                                }`}
                        >
                            <img
                                src={a.image}
                                alt={`Image for ${a.title}`}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">{a.title}</h3>
                            <p className="text-gray-700 mb-3">{a.content}</p>
                            <button className="text-sm text-blue-500 hover:underline">
                                Đọc thêm →
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "latest" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestArticles.map((a, i) => (
                        <div
                            key={i}
                            className="rounded-lg shadow-md p-5 bg-white hover:shadow-lg transition"
                        >
                            <img
                                src={a.image}
                                alt={`Image for ${a.title}`}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">{a.title}</h3>
                            <p className="text-gray-700 mb-3">{a.content}</p>
                            <button className="text-sm text-blue-500 hover:underline">
                                Đọc thêm →
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
