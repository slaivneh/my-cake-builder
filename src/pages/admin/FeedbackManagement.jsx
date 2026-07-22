import { useEffect, useState } from "react";
import "../../assets/styles/FeedbackManagement.css";

import {
    getAllFeedbacks,
    toggleFeedbackVisibility,
} from "../../services/feedbackService";

function FeedbackManagement() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeedbacks();
    }, []);

    const loadFeedbacks = async () => {
        try {
            const data = await getAllFeedbacks();
            setFeedbacks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (feedback) => {
        try {
            const updated = await toggleFeedbackVisibility(
                feedback.id,
                !feedback.isVisible
            );

            setFeedbacks((prev) =>
                prev.map((item) =>
                    item.id === updated.id ? updated : item
                )
            );
        } catch (error) {
            alert("Không thể cập nhật trạng thái.");
        }
    };

    if (loading) {
        return (
            <div className="feedback-loading">
                Đang tải danh sách đánh giá...
            </div>
        );
    }

    return (
        <div className="feedback-management">

            <div className="feedback-header">
                <div>
                    <h1>Quản lý đánh giá</h1>
                    <p>
                        Quản lý các đánh giá của khách hàng và kiểm soát việc hiển thị trên
                        trang chủ.
                    </p>
                </div>
            </div>

            {feedbacks.length === 0 ? (
                <div className="feedback-empty">
                    Chưa có đánh giá nào.
                </div>
            ) : (
                <div className="feedback-table-wrapper">
                    <table className="feedback-table">
                        <thead>
                            <tr>
                                <th>Đơn hàng</th>
                                <th>Đánh giá</th>
                                <th>Nhận xét</th>
                                <th>Ngày đánh giá</th>
                                <th>Trạng thái</th>
                                <th style={{ width: 120 }}>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {feedbacks.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <strong>#{item.orderId}</strong>
                                    </td>

                                    <td>
                                        <span className="feedback-rating">
                                            {"★".repeat(item.rating)}
                                            {"☆".repeat(5 - item.rating)}
                                        </span>
                                    </td>

                                    <td className="feedback-comment">
                                        {item.comment}
                                    </td>

                                    <td>
                                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                                    </td>

                                    <td>
                                        <span
                                            className={`feedback-status ${item.isVisible ? "visible" : "hidden"
                                                }`}
                                        >
                                            {item.isVisible ? "Hiển thị" : "Đã ẩn"}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className={`feedback-action-btn ${item.isVisible ? "hide" : "show"
                                                }`}
                                            onClick={() => handleToggle(item)}
                                        >
                                            {item.isVisible ? "Ẩn" : "Hiện"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default FeedbackManagement;