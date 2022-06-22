import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/models/user.model";

@Entity()
@ObjectType()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  @Field((_type) => Int)
  id: number;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: "CASCADE" })
  @Field((_type) => [User])
  user: User;

  @Column({ default: false })
  @Field()
  revoked: boolean;

  @Column()
  @Field()
  expires: Date;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
