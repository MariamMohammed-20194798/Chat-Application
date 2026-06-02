"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.protect = exports.login = exports.signup = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = require("../utils/appError");
const supabase_1 = require("../lib/supabase");
const userService_1 = require("../services/userService");
const mongoCompat_1 = require("../utils/mongoCompat");
const cookieOptions = (req) => ({
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    sameSite: "lax",
});
const createSendToken = async (accessToken, refreshToken, userId, statusCode, req, res) => {
    console.log("createSendToken called for user:", userId);
    const profile = await (0, userService_1.getProfileById)(userId);
    if (!profile) {
        console.error("Profile not found for user:", userId);
        res.status(500).json({ status: "error", message: "User profile not found. Please try signing up again." });
        return;
    }
    console.log("Profile found:", profile);
    const expiresDays = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 90;
    res.cookie("jwt", accessToken, {
        ...cookieOptions(req),
        expires: new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000),
    });
    if (refreshToken) {
        res.cookie("refresh_token", refreshToken, {
            ...cookieOptions(req),
            expires: new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000),
        });
    }
    const user = (0, mongoCompat_1.profileToApiUser)(profile);
    res.status(statusCode).json({
        status: "success",
        token: accessToken,
        data: { user },
    });
};
exports.signup = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    var _a;
    const { email, username, password } = req.body;
    console.log("Signup request body:", { email, username, passwordLength: password === null || password === void 0 ? void 0 : password.length });
    if (!email || !username || !password) {
        console.log("Missing fields:", { email: !email, username: !username, password: !password });
        return next(new appError_1.AppError("Username, email and password are required", 400));
    }
    if (password.length < 8) {
        return next(new appError_1.AppError("Password must be at least 8 characters", 400));
    }
    console.log("Attempting Supabase signup for:", email);
    const { data, error } = await supabase_1.supabaseAuth.auth.signUp({
        email,
        password,
        options: {
            data: { username },
        },
    });
    if (error) {
        console.error("Supabase signup error:", error);
        if (error.code === "over_email_send_rate_limit" || error.status === 429) {
            return next(new appError_1.AppError("Too many signup attempts. Please wait a few minutes and try again.", 429));
        }
        if (error.status === 0 || error.name === "AuthRetryableFetchError") {
            return next(new appError_1.AppError("Unable to connect to Supabase. Please check your network or try again later.", 503));
        }
        if (error.message.includes("already registered")) {
            return next(new appError_1.AppError("Duplicate email. Please use another value!", 500));
        }
        return next(new appError_1.AppError(error.message, 400));
    }
    console.log("Supabase signup successful, user ID:", (_a = data.user) === null || _a === void 0 ? void 0 : _a.id);
    if (!data.session || !data.user) {
        return next(new appError_1.AppError("Signup successful. Please confirm your email if required by your Supabase project settings.", 201));
    }
    await createSendToken(data.session.access_token, data.session.refresh_token, data.user.id, 201, req, res);
});
exports.login = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.AppError("Please provide email and password!", 400));
    }
    const { data, error } = await supabase_1.supabaseAuth.auth.signInWithPassword({
        email,
        password,
    });
    if (error || !data.session || !data.user) {
        return next(new appError_1.AppError("Incorrect email or password", 401));
    }
    await createSendToken(data.session.access_token, data.session.refresh_token, data.user.id, 200, req, res);
});
exports.protect = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return next(new appError_1.AppError("please login to access this route", 401));
    }
    const { data, error } = await supabase_1.supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
        return next(new appError_1.AppError("please login to access this route", 401));
    }
    const profile = await (0, userService_1.getProfileById)(data.user.id);
    if (!profile) {
        return next(new appError_1.AppError("please login to access this route", 404));
    }
    req.user = (0, mongoCompat_1.profileToApiUser)(profile);
    req.accessToken = token;
    next();
});
exports.logout = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        await supabase_1.supabaseAuth.auth.signOut();
    }
    res.cookie("jwt", "", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.cookie("refresh_token", "", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        status: "success",
        message: "logged out successfully",
        user: req.user,
    });
});
