import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { DeleteResult, UpdateResult } from "typeorm";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.users();
  }

  @Get(":userId")
  async getUserById(@Param("userId") userId: string): Promise<User> {
    return this.usersService.user(userId);
  }

  @Post()
  async signupUser(
    @Body() userData: { email: string; password: string }
  ): Promise<User> {
    return this.usersService.createUser(userData);
  }

  @Patch(":userId")
  async updateUser(
    @Param("userId") userId: string,
    @Body() data: { name: string; password: string }
  ): Promise<UpdateResult> {
    return this.usersService.updateUser(userId, data);
  }

  @Delete(":userId")
  async deleteUser(@Param("userId") userId: string): Promise<DeleteResult> {
    return this.usersService.deleteUser(userId);
  }
}
