import { Request } from "express";
import { IUser } from "../models/userModel";

export interface CustomRequestUser extends Request {
  user: IUser;
}
