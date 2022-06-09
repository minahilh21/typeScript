import { Request, Response } from "express";
// import { createCourseLoader } from "../modules/user/utils/courseLoader";

export interface MyContext {
  req: Request;
  res: Response;
  // courseLoader: ReturnType<typeof createCourseLoader>;
}