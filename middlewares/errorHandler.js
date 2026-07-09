function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const code = status === 500 ? 'INTERNAL_SERVER_ERROR'
        : status === 404 ? 'NOT_FOUND'
        : status === 401 ? 'UNAUTHORIZED'
        : 'BAD_REQUEST';

    res.status(status).json({
        success: false,
        error: {
            code,
            message: err.message
        }
    });
}

module.exports = errorHandler;