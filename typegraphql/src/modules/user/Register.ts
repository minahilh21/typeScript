import { Resolver, Query, Mutation, Arg, UseMiddleware} from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "../Middleware/isAuth";
import { logger } from "../Middleware/logger";

@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth, logger)
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }
  @Query(()=> [User])
  async allUsers(){
    return await User.find();
  }

  @Mutation(() => User)
  async register(@Arg("data")
  {
    email,
    firstName,
    lastName,
    password
  }: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();
    const oneUser = await User.findOneBy({
      id: 1,
    })
    if(oneUser) {
      oneUser.firstName = "aaa";
      oneUser.save();
      console.log(oneUser);
      return oneUser;
    }
    return user;
  }

  @Mutation(() => User)
  async update( 
    @Arg("id") id: number,
    @Arg("firstName" , { nullable: true }) firstName: string,
    @Arg("lastName", { nullable: true }) lastName: string,
  ): Promise<User | undefined> {
    const oneUser = await User.findOneBy({
       id: id,
    })
    if(oneUser) {
      if(firstName) {
      oneUser.firstName = firstName;
      }
      if(lastName) {
      oneUser.lastName = lastName;
      }
      oneUser.save();
      return oneUser;
    }
    return undefined;
  }
  
}