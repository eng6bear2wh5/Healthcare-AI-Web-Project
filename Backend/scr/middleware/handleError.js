// Middleware xử lý lỗi chung
const errorHandler = (err, req, res, next) => {
    console.error(err); // log ra server
  
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
  
    res.status(statusCode).json({
      success: false,
      message,
    });
};
  
module.exports = errorHandler;
