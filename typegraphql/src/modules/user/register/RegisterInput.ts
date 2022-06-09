import { Length, IsEmail, MinLength } from "class-validator";
// import { Course } from "src/entity/Course";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "email already in use" })
  email: string;

  @Field()
  @MinLength(3)
  password: string;

  // @Field()
  // @ArrayMaxSize(2)
  // courses: Course[];
}