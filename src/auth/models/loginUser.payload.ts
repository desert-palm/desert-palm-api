import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/user.entity";

@ObjectType()
export class LoginUserPayload {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
