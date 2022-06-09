// import { MyContext } from "src/types/MyContext";
import { ObjectType, Field, ID, Root} from "type-graphql";
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  BaseEntity, 
  OneToMany, 
  // JoinTable 
} from "typeorm";
// import { Course } from "./Course";

import { UserCourse } from "./UserCourse";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column("text", { unique: true })
  email: string;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }
  @Field()
  @Column({default: "client"})
  role: string;

  @Column()
  password: string;

  @Column("bool", {default:false})
  confirmed: Boolean;
  
  @OneToMany(() => UserCourse, user_course => user_course.user)
  user_course: UserCourse[];
}