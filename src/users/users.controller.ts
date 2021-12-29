import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UsersService } from "./users.service";

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
    @Body() body: { name: string; email: string }
  ) {
    return this.usersService.updateUser(userId, body);
  }

  @Delete(":userId")
  async deleteUser(@Param("userId") userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
