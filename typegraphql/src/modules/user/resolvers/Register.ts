import { Resolver, Query, Mutation, Arg} from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../../entity/User";
import { sendEmail } from "./../utils/sendEmail";
import { createConfirmationUrl } from "./../utils/createConfirmationUrl";
import { Course } from "../../../entity/Course";

@Resolver()
export class RegisterResolver {
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }

  @Mutation(() => User)
  async register(
    @Arg("email") email: string,
    @Arg("firstName" ) firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("password") password: string,
    @Arg("courseName", {nullable:true}) courseName: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const course = await Course.findOneBy({ courseName: courseName});
    console.log(course);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    await sendEmail(email, await createConfirmationUrl(user.id));
    return user;
  }
}


