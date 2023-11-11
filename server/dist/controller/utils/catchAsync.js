"use strict";
// utils/catchAsync.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
const catchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (err) {
            // Log the error for debugging purposes
            console.error(err);
            // Send a proper error response to the client
            res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    };
};
exports.catchAsync = catchAsync;
