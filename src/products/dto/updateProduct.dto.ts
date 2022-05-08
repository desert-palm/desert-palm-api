import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";

export class UpdateProductDto {
  @ApiProperty()
  @ValidateIf((product) => product.name)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @ValidateIf((product) => product.description)
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @ValidateIf((product) => product.price)
  @IsNumber()
  price: number;
}
