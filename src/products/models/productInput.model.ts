import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class ProductInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field((_type) => Int)
  price: number;
}
