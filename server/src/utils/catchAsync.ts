// utils/catchAsync.ts

import { RequestHandler, Request, Response, NextFunction } from "express";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err: any) {
      // Log the error for debugging purposes
      console.error(err);

      // Send a proper error response to the client
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  };
};
