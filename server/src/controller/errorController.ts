import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

const handleInvalidUUID = (): AppError =>
  new AppError("Invalid ID format.", 400);

const handleDuplicateFieldsDB = (err: { message?: string }): AppError => {
  const message =
    err.message?.includes("duplicate") || err.message?.includes("unique")
      ? `Duplicate field value. Please use another value!`
      : "Duplicate field value. Please use another value!";
  return new AppError(message, 400);
};

const handleAuthError = (message: string): AppError =>
  new AppError(message, 401);

const sendErrorDev = (err: AppError, req: Request, res: Response): void => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.error("ERROR", err);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

const sendErrorProd = (err: AppError, req: Request, res: Response): void => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error("ERROR", err);
      res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
    }
  } else {
    res.status(err.statusCode || 500).json({
      status: "error",
      message: err.isOperational ? err.message : "Something went wrong!",
    });
  }
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const error = err as AppError & { code?: string };
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, req, res);
  } else {
    let handledError = { ...error };
    handledError.message = error.message;

    if (error.code === "22P02" || error.message?.includes("invalid input syntax"))
      handledError = handleInvalidUUID();
    if (error.code === "23505")
      handledError = handleDuplicateFieldsDB(handledError);
    if (
      error.name === "AuthApiError" ||
      error.message?.includes("JWT") ||
      error.message?.includes("token")
    )
      handledError = handleAuthError("Invalid or expired token. Please log in again.");

    sendErrorProd(handledError, req, res);
  }
};

export default errorHandler;
