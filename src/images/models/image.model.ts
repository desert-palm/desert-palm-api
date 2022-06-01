import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Image {
  @Field((_type) => Int)
  id: number;

  @Field()
  filename: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
