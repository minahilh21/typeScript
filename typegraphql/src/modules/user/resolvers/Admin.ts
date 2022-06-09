import { Resolver, Query,Arg} from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../../entity/User";
// import { isAuth } from "../Middleware/isAuth";
// import { logger } from "../Middleware/logger";
import jwt from "jsonwebtoken";
// import { Course } from "../../../entity/Course";

require('dotenv').config();

@Resolver()
export class AdminResolver {
  @Query(() => String)
  async getToken(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string> {
    const user = await User.findOne({ where: {email} });
    if(!user) {
    throw new Error("not authenticated");
    }
    if(user.role !== "admin") {
      throw new Error("not authenticated");
    }
    const valid  = bcrypt.compare(password, user.password);
    if(!valid) {
      throw new Error("not authenticated");
    }
    return jwt.sign({
      id: user.id,
      email: email,
      role: user.role
    }, process.env.SECRET_KEY!,{ expiresIn: "1d"});
  }
}