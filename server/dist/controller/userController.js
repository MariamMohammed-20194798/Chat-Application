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
exports.getMe = exports.getAll = exports.updateMe = exports.uploadUserPhoto = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = require("../utils/appError");
const userService_1 = require("../services/userService");
const mongoCompat_1 = require("../utils/mongoCompat");
const cloudinary = __importStar(require("cloudinary"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: ".env" });
const cloudinaryV2 = cloudinary.v2;
cloudinaryV2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const multerStorage = multer_1.default.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb(new appError_1.AppError("Please upload only images.", 400), false);
    }
};
const upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single("photo");
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
    let filteredBody = filterObj(req.body, "username", "photo");
    if (!req.file) {
        filteredBody = filterObj(req.body, "username");
    }
    else if (req.file) {
        req.file.filename = `user-${(_a = req.user) === null || _a === void 0 ? void 0 : _a._id}.jpeg`;
        await (0, sharp_1.default)(req.file.buffer)
            .resize(500, 500)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`imgs/${req.file.filename}`);
        const result = await cloudinaryV2.uploader.upload(`imgs/${req.file.filename}`);
        filteredBody.photo = result.secure_url;
    }
    const updated = await (0, userService_1.updateProfile)(req.user._id, filteredBody);
    res.status(200).json({
        status: "success",
        data: {
            user: updated ? (0, mongoCompat_1.profileToApiUser)(updated) : req.user,
        },
    });
});
exports.getAll = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const profiles = await (0, userService_1.getAllProfilesExcept)(req.user._id);
    const users = (0, mongoCompat_1.profileToApiUsers)(profiles);
    res.status(200).json({
        status: "success",
        results: users.length,
        data: users,
    });
});
exports.getMe = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const profile = await (0, userService_1.getProfileById)(req.user._id);
    res.status(200).json({
        status: "success",
        data: {
            data: profile ? (0, mongoCompat_1.profileToApiUser)(profile) : req.user,
        },
    });
});
