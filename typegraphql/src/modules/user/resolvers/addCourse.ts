import { Resolver,Mutation, Arg, Int} from "type-graphql";
import { Course } from "../../../entity/Course";
import { UserCourse } from "../../../entity/UserCourse";

@Resolver()
export class AddCourseResolver {
  @Mutation(()=>Course)
  async addCourse (
    @Arg("courseName", {nullable:true}) courseName: string
  ): Promise<Course> {
    const course = Course.create ({
      courseName
  }).save();
    return course;
  }
  @Mutation(() => Boolean)
  async addUserCourse(
    @Arg("courseId", () => Int) courseId: number,
    @Arg("userId", () => Int) userId: number
  ) {
    await UserCourse.create({ courseId, userId }).save();
    return true;
  }
}


