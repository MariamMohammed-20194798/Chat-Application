"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("../utils/appError");
const handleInvalidUUID = () => new appError_1.AppError("Invalid ID format.", 400);
const handleDuplicateFieldsDB = (err) => {
    var _a, _b;
    const message = ((_a = err.message) === null || _a === void 0 ? void 0 : _a.includes("duplicate")) || ((_b = err.message) === null || _b === void 0 ? void 0 : _b.includes("unique"))
        ? `Duplicate field value. Please use another value!`
        : "Duplicate field value. Please use another value!";
    return new appError_1.AppError(message, 400);
};
const handleAuthError = (message) => new appError_1.AppError(message, 401);
const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    else {
        console.error("ERROR", err);
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
};
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        else {
            console.error("ERROR", err);
            res.status(500).json({
                status: "error",
                message: "Something went very wrong!",
            });
        }
    }
    else {
        res.status(err.statusCode || 500).json({
            status: "error",
            message: err.isOperational ? err.message : "Something went wrong!",
        });
    }
};
const errorHandler = (err, req, res, _next) => {
    var _a, _b, _c;
    const error = err;
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(error, req, res);
    }
    else {
        let handledError = { ...error };
        handledError.message = error.message;
        if (error.code === "22P02" || ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes("invalid input syntax")))
            handledError = handleInvalidUUID();
        if (error.code === "23505")
            handledError = handleDuplicateFieldsDB(handledError);
        if (error.name === "AuthApiError" ||
            ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes("JWT")) ||
            ((_c = error.message) === null || _c === void 0 ? void 0 : _c.includes("token")))
            handledError = handleAuthError("Invalid or expired token. Please log in again.");
        sendErrorProd(handledError, req, res);
    }
};
exports.default = errorHandler;
