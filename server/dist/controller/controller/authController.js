"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.protect = exports.login = exports.signup = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = require("../utils/appError");
const jsonwebtoken_1 = require("jsonwebtoken");
const jsonwebtoken_2 = __importDefault(require("jsonwebtoken"));
const signToken = (id) => {
    return jsonwebtoken_2.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "90d",
    });
};
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};
// SIGNUP FUNCTION
exports.signup = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const newUser = await UserModel_1.default.create({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
    });
    createSendToken(newUser, 201, req, res);
});
// LOGIN FUNCTION
exports.login = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    // 1. Check If email Or Pass is exist
    if (!email || !password) {
        return next(new appError_1.AppError("Please provide email and password!", 400));
    }
    // 2. Check If User Exist & password is correct
    const user = await UserModel_1.default.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new appError_1.AppError("Incorrect email or password", 401));
    }
    // 3. Send Token if every thing is okay
    createSendToken(user, 200, req, res);
});
const jwtVerifyPromisified = (token, secret) => {
    return new Promise((resolve, reject) => {
        (0, jsonwebtoken_1.verify)(token, secret, {}, (err, payload) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(payload);
            }
        });
    });
};
exports.protect = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    // 1) check if token is there and if it exists
    let token = req.cookies.jwt;
    if (!token) {
        return next(new appError_1.AppError("please login to access this route", 401));
    }
    // 2) Verify Token
    const decoded = (await jwtVerifyPromisified(token, process.env.JWT_SECRET));
    // 3) check if user exist
    const currentUser = (await UserModel_1.default.findById(decoded.id));
    if (!currentUser) {
        return next(new appError_1.AppError("please login to access this route", 404));
    }
    req.user = currentUser;
    next();
});
exports.logout = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const user = req.user;
    res.cookie("jwt", "", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        status: "success",
        message: "logged out successfully",
        user,
    });
});
