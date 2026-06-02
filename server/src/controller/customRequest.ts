import { Request } from "express";
import { IUserResponse } from "../types/database";

export interface CustomRequest<T = Request["body"]> extends Request {
  body: T;
  user?: IUserResponse;
  accessToken?: string;
}
