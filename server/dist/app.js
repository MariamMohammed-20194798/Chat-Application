"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("./loadEnv");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRouter_1 = require("./routers/userRouter");
const roomRoutes_1 = require("./routers/roomRoutes");
const errorController_1 = __importDefault(require("./controller/errorController"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
exports.app.options("*", (0, cors_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
});
exports.app.use("/api", limiter);
if (process.env.NODE_ENV === "development") {
    exports.app.use((0, morgan_1.default)("dev"));
}
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use("/api/v1/users", userRouter_1.router);
exports.app.use("/api/v1/room", roomRoutes_1.router);
exports.app.use(errorController_1.default);
