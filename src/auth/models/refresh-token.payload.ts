import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RefreshTokenPayload {
  @Field()
  access_token: string;
}
