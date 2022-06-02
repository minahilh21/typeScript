import { Resolver, Mutation, Arg, UseMiddleware} from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { isAuth } from "../Middleware/isAuth";
import { logger } from "../Middleware/logger";

@Resolver()
export class UpdateResolver {
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
}