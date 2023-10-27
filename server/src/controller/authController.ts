import User from "../models/UserModel";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import { CustomRequest } from "./customRequest";
import { IUser } from "../models/UserModel";
import { JwtPayload } from "jsonwebtoken";
import { verify as verifyJWT } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};

const createSendToken = (
  user: any,
  statusCode: number,
  req: Request,
  res: Response
): void => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
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

interface SignupBody {
  email: string;
  username: string;
  password: string;
  photo: string;
}
// SIGNUP FUNCTION
export const signup: RequestHandler = catchAsync(
  async (req: CustomRequest<SignupBody>, res, next) => {
    const newUser: {} = await User.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    });
    createSendToken(newUser, 201, req, res);
  }
);

// LOGIN FUNCTION
export const login: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const { email, password } = req.body;
    // 1. Check If email Or Pass is exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    // 2. Check If User Exist & password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
    // 3. Send Token if every thing is okay
    createSendToken(user, 200, req, res);
  }
);

export interface DecodedToken extends JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

const jwtVerifyPromisified = (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    verifyJWT(token, secret, {}, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

export const protect: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next) => {
    // 1) check if token is there and if it exists
    let token: string | undefined = req.cookies.jwt;

    if (!token) {
      return next(new AppError("please login to access this route", 401));
    }

    // 2) Verify Token

    const decoded = (await jwtVerifyPromisified(
      token,
      process.env.JWT_SECRET
    )) as DecodedToken;

    // 3) check if user exist
    const currentUser = (await User.findById(decoded.id)) as IUser;
    if (!currentUser) {
      return next(new AppError("please login to access this route", 404));
    }
    req.user = currentUser;

    next();
  }
);

export const logout: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
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
  }
);
