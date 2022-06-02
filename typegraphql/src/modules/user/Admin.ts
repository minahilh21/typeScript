import { Resolver, Query, Mutation, Arg, UseMiddleware} from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { isAuth } from "../Middleware/isAuth";
import { logger } from "../Middleware/logger";
import jwt from "jsonwebtoken";
require('dotenv').config();

@Resolver()
export class AdminResolver {
  @UseMiddleware(isAuth, logger)
  @Query(()=> [User])
  async allUsers(){
    return await User.find();
  }
  @UseMiddleware(isAuth, logger)
  @Query(() => User)
  async oneUser(
    @Arg("email") email: string,
  ): Promise<User | null> {
    const oneUser = await User.findOneBy({
      email: email,
    })
    if(oneUser) {
      return oneUser;
    }
    return null;
  }
  @UseMiddleware(isAuth, logger)
  @Mutation(() => User)
  async updateUser( 
    @Arg("email") email: string,
    @Arg("firstName" , { nullable: true }) firstName: string,
    @Arg("lastName", { nullable: true }) lastName: string,
    @Arg("password", { nullable: true }) password: string,
    @Arg("role", { nullable: true }) role: string,
  ): Promise<User | undefined> {
    const oneUser = await User.findOneBy({
       email: email,
    })
    if(oneUser) {
      if(firstName) {
        oneUser.firstName = firstName;
      }
      if(lastName) {
        oneUser.lastName = lastName;
      }
      if(password) {
        oneUser.password = await bcrypt.hash(password, 12);
      }
      if(role) {
        oneUser.role = role;
      }
      oneUser.save();
      return oneUser;
    }
    return undefined;
  }
  @UseMiddleware(isAuth, logger)
  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("email") email: string,
  ): Promise<boolean> {
    const oneUser = await User.findOneBy({
      email: email,
    })
    if(oneUser) {
      oneUser.remove();
      return true;
    }
    return false;
  }
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