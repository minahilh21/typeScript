import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Course } from "./Course";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class UserCourse extends BaseEntity {
  @Field()
  @Column()
  courseId: number;

  @Field()
  @Column()
  userId: number;

  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @ManyToOne(() => Course, course => course.user_course)
  @JoinColumn({ name: "courseId" })
  course: Course;

  @Field()
  @ManyToOne(() => User, user => user.user_course)
  @JoinColumn({ name: "userId" })
  user: User;
}