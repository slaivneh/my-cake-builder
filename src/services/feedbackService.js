import axiosClient from "./axiosClient";

export const getFeedbackByOrderId = async (orderId) => {
    const data = await axiosClient.get("/feedbacks", {
        params: { orderId },
    });

    return Array.isArray(data) ? data[0] : null;
};

export const createFeedback = async (feedback) => {
    return axiosClient.post("/feedbacks", feedback);
};

export const updateFeedback = async (id, feedback) => {
    return axiosClient.patch(`/feedbacks/${id}`, feedback);
};

export const getAllFeedbacks = async () => {
    return axiosClient.get("/feedbacks");
};

export const toggleFeedbackVisibility = async (
    id,
    isVisible
) => {
    return axiosClient.patch(`/feedbacks/${id}`, {
        isVisible,
    });
};