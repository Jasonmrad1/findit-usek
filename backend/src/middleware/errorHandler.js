import { ApiError } from "../errors/ApiError.js";

// Express recognizes error middleware by its four arguments.
export function errorHandler(error, _req, res, _next) {
  if (error instanceof ApiError) {
    return res.status(error.status).json({
      message: error.message,
      ...(error.errors ? { errors: error.errors } : {}),
    });
  }
  const status =
    error.type === "entity.parse.failed"
      ? 400
      : error.status === 413
        ? 413
        : 500;
  return res.status(status).json({
    message:
      status === 400
        ? "Request body must be valid JSON."
        : status === 413
          ? "Request body is too large."
          : "Something went wrong. Please try again.",
  });
}
