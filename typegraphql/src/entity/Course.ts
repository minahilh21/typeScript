import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity, 
  Column, 
  PrimaryGeneratedColumn,
  BaseEntity, 
  OneToMany,
} from "typeorm";
import { UserCourse } from "./UserCourse";

@ObjectType()
@Entity()
export class Course extends BaseEntity{
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  courseId: number;

  @Field()
  @Column()
  courseName: string;

  @OneToMany(() => UserCourse, user_course => user_course.course)
  user_course: UserCourse[];
}