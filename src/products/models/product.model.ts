import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Image } from "../../images/models/image.model";

@ObjectType()
export class Product {
  @Field((_type) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field((_type) => Int)
  price: string;

  @Field((_type) => [Image])
  images: Image[];

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
