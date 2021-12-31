import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get(":userId")
  async getUser(@Param("userId") userId: string) {
    return this.usersService.getUser({ where: { id: userId } });
  }

  @Patch(":userId")
  async updateUser(
    @Param("userId") userId: string,
    @Body() body: UpdateUserDto
  ) {
    return this.usersService.updateUser(userId, body);
  }

  @Delete(":userId")
  async deleteUser(@Param("userId") userId: string) {
    this.usersService.deleteUser(userId);
  }
}
