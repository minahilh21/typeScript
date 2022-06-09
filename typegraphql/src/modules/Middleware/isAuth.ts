import { MiddlewareFn } from "type-graphql";

import { MyContext } from "../../types/MyContext";
import { verify } from "jsonwebtoken";
require('dotenv').config();

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  if (!authorization) {
    throw new Error("Not authenticated");
  }
  if(verify(authorization, process.env.SECRET_KEY!)){
    return next();
  }
  else {
   throw new Error("Not authenticated");
  }
};

