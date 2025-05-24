export const error_response = (res, error) => {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: error.message || "Something went wrong.",
        data: {},
        error: error.explanation || {}
    });
};
