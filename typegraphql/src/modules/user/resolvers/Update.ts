import { Resolver, Mutation, Arg, UseMiddleware, Int} from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../../entity/User";
import { isAuth } from "../../Middleware/isAuth";
import { logger } from "../../Middleware/logger";
import { Course } from "../../../entity/Course";
import { UserCourse } from "../../../entity/UserCourse";

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
    const user = await User.findOneBy({
       email: email,
    })
    if(user) {
      if(firstName) {
        user.firstName = firstName;
      }
      if(lastName) {
        user.lastName = lastName;
      }
      if(password) {
        user.password = await bcrypt.hash(password, 12);
      }
      if(role) {
        user.role = role;
      }
      user.save();
      return user;
    }
    return undefined;
  }
  @UseMiddleware(isAuth, logger)
  @Mutation(() => Course)
  async updateCourse( 
    @Arg("courseId", () => Int) courseId: number,
    @Arg("courseName") courseName: string,
  ): Promise<Course | undefined> {
    const course = await Course.findOneBy({
      courseId
    })
    if(course) {
        course.courseName = courseName;
      course.save();
      return course;
    }
    return undefined;
  }
  @UseMiddleware(isAuth, logger)
  @Mutation(() => UserCourse)
  async updateUserCourse( 
    @Arg("id", () => Int) id: number,
    @Arg("courseId", () => Int) courseId: number,
    @Arg("userId", () => Int) userId: number  
  ): Promise<UserCourse | undefined> {
    const userCourse = await UserCourse.findOneBy({
       id
    })
    if(userCourse) {
      userCourse.userId = userId;
      userCourse.courseId = courseId;

      userCourse.save();
      return userCourse;
    }
    return undefined;
  }
}