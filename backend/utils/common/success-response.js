export const success_response = (res, message = "Successfully executed the request", data = {}) => {
    return res.status(200).json({
        success: true,
        message,
        data,
        error: {}
    });
};
