import { Resolver, Query,Arg} from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../../entity/User";
// import { isAuth } from "../Middleware/isAuth";
// import { logger } from "../Middleware/logger";
import jwt from "jsonwebtoken";
require('dotenv').config();

@Resolver()
export class AdminResolver {
  // @UseMiddleware(isAuth, logger)
  // @Mutation(() => Boolean)
  // async deleteUser(
  //   @Arg("email") email: string,
  // ): Promise<boolean> {
  //   const oneUser = await User.findOneBy({
  //     email: email,
  //   })
  //   if(oneUser) {
  //     oneUser.remove();
  //     return true;
  //   }
  //   return false;
  // }
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