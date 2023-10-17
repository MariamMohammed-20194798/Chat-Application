import { Request } from "express";

export interface CustomRequestUser<T, U> extends Request {
  body: T;
  user: U;
}
