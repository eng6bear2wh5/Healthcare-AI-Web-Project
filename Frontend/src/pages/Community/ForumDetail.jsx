import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ForumDetail = () => {
    const { topicId } = useParams();
    const [forumTopic, setForumTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForumDetails = async () => {
            try {
                // Giả sử bạn có một API trả về dữ liệu diễn đàn
                const response = await fetch(`/api/forums/${topicId}`);
                const data = await response.json();
                setForumTopic(data);
                setLoading(false);
            } catch (error) {
                console.error("Có lỗi xảy ra khi lấy dữ liệu", error);
                setLoading(false);
            }
        };

        fetchForumDetails();
    }, [topicId]);

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="max-w-4xl mx-auto p-4 relative">
            <h1 className="text-2xl font-bold mb-6 text-blue-700">Chi tiết diễn đàn</h1>
            {forumTopic ? (
                <>
                    <h2 className="text-xl font-semibold text-blue-600">{forumTopic.title}</h2>
                    <p className="text-gray-700">{forumTopic.description}</p>
                    {/* Hiển thị thêm các bình luận hoặc phần chat tại đây */}
                </>
            ) : (
                <p>Không tìm thấy diễn đàn này.</p>
            )}
        </div>
    );
};

export default ForumDetail;
