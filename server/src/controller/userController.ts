import multer from "multer";
import sharp from "sharp";
import { RequestHandler } from "express";
import { CustomRequest } from "./customRequest";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import {
  getAllProfilesExcept,
  getProfileById,
  updateProfile,
} from "../services/userService";
import { profileToApiUser, profileToApiUsers } from "../utils/mongoCompat";
import * as cloudinary from "cloudinary";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto: RequestHandler = upload.single("photo");

const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el: string) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateMe: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    let filteredBody = filterObj(req.body, "username", "photo");

    if (!req.file) {
      filteredBody = filterObj(req.body, "username");
    } else if (req.file) {
      req.file.filename = `user-${req.user?._id}.jpeg`;

      await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`imgs/${req.file.filename}`);

      const result = await cloudinaryV2.uploader.upload(
        `imgs/${req.file.filename}`
      );
      filteredBody.photo = result.secure_url;
    }

    const updated = await updateProfile(req.user!._id, filteredBody);

    res.status(200).json({
      status: "success",
      data: {
        user: updated ? profileToApiUser(updated) : req.user,
      },
    });
  }
);

export const getAll: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const profiles = await getAllProfilesExcept(req.user!._id);
    const users = profileToApiUsers(profiles);

    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  }
);

export const getMe: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const profile = await getProfileById(req.user!._id);

    res.status(200).json({
      status: "success",
      data: {
        data: profile ? profileToApiUser(profile) : req.user,
      },
    });
  }
);
