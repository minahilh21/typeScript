import { Resolver, Mutation, Arg, UseMiddleware} from "type-graphql";

import { User } from "../../entity/User";
import { isAuth } from "../Middleware/isAuth";
import { logger } from "../Middleware/logger";
require('dotenv').config();

@Resolver()
export class DeleteResolver {
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
}