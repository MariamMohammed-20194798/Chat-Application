import sharp from "sharp";
import * as cloudinary from "cloudinary";
import User from "../models/UserModel";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

import multer from "multer";

import { RequestHandler, Request, Response } from "express";
import { CustomRequest } from "./customRequest";

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: "dwjot1zhy",
  api_key: "562937548765246",
  api_secret: "XlZxwlVoZndfWq3OUNP58rpHXZM",
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("photo");

const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el: string) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateMe: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user?.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(req.file.filename);

    const filteredBody = filterObj(req.body, "username", "email", "photo");

    if (req.file) {
      const result = await cloudinaryV2.uploader.upload(req.file.filename);
      filteredBody.photo = result.secure_url;
    }
    if (!req.file) return next();

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
  async (req: CustomRequest, res: Response, next) => {
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
