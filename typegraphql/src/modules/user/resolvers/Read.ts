import { Resolver, Query,Arg, UseMiddleware} from "type-graphql";

import { User } from "../../../entity/User";
import { isAuth } from "../../Middleware/isAuth";
import { logger } from "../../Middleware/logger";

@Resolver()
export class ReadResolver {
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
}