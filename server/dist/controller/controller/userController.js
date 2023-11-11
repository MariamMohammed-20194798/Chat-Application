"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.getAll = exports.updateMe = exports.resizeUserPhoto = exports.uploadUserPhoto = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = require("../utils/appError");
const UserModel_1 = __importDefault(require("../models/UserModel"));
const cloudinary = __importStar(require("cloudinary"));
const cloudinaryV2 = cloudinary.v2;
cloudinaryV2.config({
    cloud_name: "dwjot1zhy",
    api_key: "562937548765246",
    api_secret: "XlZxwlVoZndfWq3OUNP58rpHXZM",
});
const multerStorage = multer_1.default.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb(new appError_1.AppError("Not an image! Please upload only images.", 400), false);
    }
};
const upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single("photo");
exports.resizeUserPhoto = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    var _a;
    if (!req.file)
        return next();
    req.file.filename = `user-${(_a = req.user) === null || _a === void 0 ? void 0 : _a.id}-${Date.now()}.jpeg`;
    const filePath = path_1.default.join(__dirname, "imgs", req.file.filename);
    console.log("File path:", filePath);
    await (0, sharp_1.default)(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(filePath);
    next();
});
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el))
            newObj[el] = obj[el];
    });
    return newObj;
};
exports.updateMe = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    var _a;
    // 1) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "username");
    if (req.file) {
        // Upload photo to Cloudinary
        const result = await cloudinaryV2.uploader.upload(req.file.path);
        filteredBody.photo = result.secure_url;
    }
    // 2) Update user document
    const updatedUser = await UserModel_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, filteredBody, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});
exports.getAll = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    var _a;
    const users = await UserModel_1.default.find({ _id: { $ne: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id } }).select("-password -__v");
    res.status(200).json({
        status: "success",
        results: users.length,
        data: users,
    });
});
exports.getMe = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    var _a;
    console.log(req.user);
    const user = await UserModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    res.status(200).json({
        status: "success",
        data: {
            data: user,
        },
    });
});
