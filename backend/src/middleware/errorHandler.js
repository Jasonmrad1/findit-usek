export function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  res.status(status).json({
    message: status >= 500 ? "Something went wrong. Please try again." : error.message,
    errors: error.errors,
  });
}
