import { Request } from "express";
import { IUser } from "../models/UserModel";

export interface CustomRequest<T = Request["body"]> extends Request {
  body: T;
  user?: IUser;
}
