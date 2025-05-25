import React from "react";
import { Link } from "react-router-dom";

const ForumButton = () => {
    return (
        <div className="absolute bottom-4 right-4">
            <Link to="/Community/Forum">
                <button className="bg-blue-600 text-white p-3 rounded-full">
                    Tham gia diễn đàn
                </button>
            </Link>
        </div>
    );
};

export default ForumButton;
