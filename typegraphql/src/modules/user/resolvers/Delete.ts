import { UserCourse } from "../../../entity/UserCourse";
import { Resolver, Mutation, Arg, UseMiddleware, Int} from "type-graphql";

import { User } from "../../../entity/User";
import { isAuth } from "../../Middleware/isAuth";
import { logger } from "../../Middleware/logger";
import { Course } from "../../../entity/Course";
require('dotenv').config();

@Resolver()
export class DeleteResolver {
  @UseMiddleware(isAuth, logger)
  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("userId") userId: number,
  ): Promise<boolean> {
    const oneUser = await User.findOneBy({
      id: userId,
    })
    if(oneUser) {
    await UserCourse.delete({ userId });
      oneUser.remove();
      return true;
    }
    return false;
  }

  @Mutation(() => Boolean)
  async deleteCourse(@Arg("courseId", () => Int) courseId: number) {
    await UserCourse.delete({ courseId });
    await Course.delete({ courseId: courseId });
    return true;
  }
  @Mutation(() => Boolean)
  async deleteUserCourse(@Arg("id", () => Int) id: number) {
    await UserCourse.delete({ id });
    return true;
  }
}