// IMPORTS
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { json } from "body-parser";
import cookieParser from "cookie-parser";
import { router as userRouter } from "./routers/userRouter";
import { router as roomRoutes } from "./routers/roomRoutes";
import globalErrorHandler from "./controller/errorController";

// ###########################################################
// Initialize Express app
dotenv.config({ path: "./.env" });
export const app = express();
app.use(json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.options("*", cors());

// ###########################################################
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);
app.use(globalErrorHandler);

// ###########################################################
// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cookieParser());
// ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/room", roomRoutes);
