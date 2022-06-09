import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../../entity/User";
import { redis } from "../../../redis";
import { MyContext } from "../../../types/MyContext";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("token") token: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get('forgot_password'+ token);

    if (!userId) {
      return null;
    }
    const user = await User.findOneBy({id: parseInt(userId)});

    if (!user) {
      return null;
    }
    await redis.del('forgot_password' + token);

    user.password = await bcrypt.hash(password, 12);

    await user.save();

    ctx.req.session!.userId = user.id;

    return user;
  }
}

