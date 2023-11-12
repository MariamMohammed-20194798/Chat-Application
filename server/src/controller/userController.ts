import multer from "multer";
import sharp from "sharp";
import { RequestHandler } from "express";
import { CustomRequest } from "./customRequest";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import User from "../models/UserModel";
import * as cloudinary from "cloudinary";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const cloudinaryV2 = cloudinary.v2;
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("API_KEY:", process.env.API_KEY);
console.log("API_SECRET:", process.env.API_SECRET);

cloudinaryV2.config({
  cloud_name: "dwjot1zhy",
  api_key: "562937548765246",
  api_secret: "XlZxwlVoZndfWq3OUNP58rpHXZM",
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

// Middleware to upload a single photo
export const uploadUserPhoto: RequestHandler = upload.single("photo");

// Helper function to filter object properties
const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el: string) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Middleware to update user data
export const updateMe: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    // 1) Filter out unwanted fields that are not allowed to be updated
    let filteredBody = filterObj(req.body, "username", "photo");

    if (!req.file) {
      filteredBody = filterObj(req.body, "username");
    } else if (req.file) {
      req.file.filename = `user-${req.user?.id}.jpeg`;

      await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`imgs/${req.file.filename}`);

      // 2) If a file is provided, upload it to Cloudinary and update the photo property
      if (req.file) {
        const result = await cloudinaryV2.uploader.upload(
          `imgs/${req.file.filename}`
        );
        filteredBody.photo = result.secure_url;
      }
    }

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

export const getAll: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const users = await User.find({ _id: { $ne: req.user?.id } }).select(
      "-password -__v"
    );
    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  }
);

export const getMe: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    console.log(req.user);

    const user = await User.findById(req.user?.id);

    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  }
);
