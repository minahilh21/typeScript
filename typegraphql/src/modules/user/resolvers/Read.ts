import { Course } from "../../../entity/Course";
import { Resolver, Query,Arg, UseMiddleware} from "type-graphql";

import { User } from "../../../entity/User";
import { isAuth } from "../../Middleware/isAuth";
import { logger } from "../../Middleware/logger";
import { UserCourse } from "../../../entity/UserCourse";

@Resolver()
export class ReadResolver {
  @UseMiddleware(isAuth, logger)
  @Query(() => User)
  async oneUser(
    @Arg("email") email: string,
  ): Promise<User | null> {
    const oneUser = await User.findOneBy({
      email: email,
    })
    return oneUser;
  }
  @UseMiddleware(isAuth, logger)
  @Query(()=> [Course])
  async allCourses(){
    return await Course.find();
  }
  @UseMiddleware(isAuth, logger)
  @Query(()=> [User])
  async allUsers(){
    return await User.find();
  }
  @UseMiddleware(isAuth, logger)
  @Query(() => [UserCourse])
  async allUsersWithCourses() {
    const userCourse = UserCourse.getRepository().createQueryBuilder("userCourse")
    .leftJoinAndSelect("userCourse.course", "course")
    .leftJoinAndSelect("userCourse.user", "user")
    .getMany();
    return await userCourse;
  }
}

