import multer from "multer";
import sharp from "sharp";
const cloudinary = require("cloudinary").v2;
import User from "../models/userModel";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import { RequestHandler, Request, Response, NextFunction } from "express";
import { CustomRequest } from "./customRequest";
import { CustomRequestUser } from "./customRequestUser";

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload only images.", 404), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto: RequestHandler = catchAsync(
  async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`src/data/${req.file.filename}`);

    next();
  }
);

export const filterObj = (obj: any, ...allowedFields: any) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

interface UpdateBody {
  password: string;
}

export const updateMe: RequestHandler = catchAsync(
  async (req: CustomRequest<UpdateBody>, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "username", "email");
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const Id = req.params;
    const updatedUser = await User.findByIdAndUpdate(Id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

export const getAll: RequestHandler = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      data: users,
    },
  });
});

/* export const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
}; */
