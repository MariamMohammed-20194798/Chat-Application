import "./loadEnv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { router as userRouter } from "./routers/userRouter";
import { router as roomRoutes } from "./routers/roomRoutes";
import globalErrorHandler from "./controller/errorController";
import { handleSendEmailHook } from "./controller/sendEmailHookController";

export const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.options("*", cors());

const sendEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: { message: "Too many email requests. Please try again later." },
  },
});

// Raw body is required to verify the Standard Webhooks signature.
app.post(
  "/api/v1/auth/send-email",
  sendEmailLimiter,
  express.raw({ type: () => true, limit: "100kb" }),
  handleSendEmailHook,
);

app.use(express.json());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/room", roomRoutes);

app.use(globalErrorHandler);
