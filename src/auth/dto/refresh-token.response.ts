import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/user.entity";

export class RefreshTokenResponse {
  @ApiProperty()
  user: User;

  @ApiProperty()
  accessToken: string;
}
