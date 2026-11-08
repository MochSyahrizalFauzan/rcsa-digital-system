/**
 * Operational Application Error
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Rute ${req.method} ${req.originalUrl} tidak ditemukan`, 404));
};

/**
 * Global Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Terjadi kesalahan pada server";

  console.error(`[SERVER ERROR] ${req.method} ${req.originalUrl} (${statusCode}):`, message);
  if (statusCode === 500 && process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    message,
    ...(err.details ? { errors: err.details } : {}),
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
};

export default {
  AppError,
  notFoundHandler,
  errorHandler,
};
