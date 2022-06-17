import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/user.entity";

export class RegisterUserResponse {
  @ApiProperty()
  user: User;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
