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
    return this.usersService.getUsers();
  }

  @Get(":userId")
  async getUser(@Param("userId") userId: string): Promise<User> {
    return this.usersService.getUser(userId);
  }

  @Post()
  async createUser(
    @Body() body: { name: string; email: string }
  ): Promise<User> {
    return this.usersService.createUser(body);
  }

  @Patch(":userId")
  async updateUser(
    @Param("userId") userId: string,
    @Body() body: { name: string; email: string }
  ): Promise<UpdateResult> {
    return this.usersService.updateUser(userId, body);
  }

  @Delete(":userId")
  async deleteUser(@Param("userId") userId: string): Promise<DeleteResult> {
    return this.usersService.deleteUser(userId);
  }
}
