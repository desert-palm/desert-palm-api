import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class LoginPayload {
  @Field()
  access_token: string;

  // TODO: Uncomment when ready to implement refresh tokens
  // @Field()
  // refreshToken: string;
}
