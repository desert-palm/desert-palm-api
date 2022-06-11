import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  Request,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { UsersService } from "./users.service";

interface RequestWithUser extends Request {
  user: { email: string; userId: number };
}

@ApiTags("users")
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("current")
  async getCurrentUser(@Request() req: RequestWithUser) {
    return this.usersService.getUserById(req.user.userId);
  }

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get(":userId")
  async getUser(@Param("userId", ParseIntPipe) userId: number) {
    return this.usersService.getUserById(userId);
  }

  @Patch(":userId")
  async updateUser(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() body: UpdateUserDto
  ) {
    return this.usersService.updateUser(userId, body);
  }

  @Delete(":userId")
  async deleteUser(@Param("userId", ParseIntPipe) userId: number) {
    this.usersService.deleteUser(userId);
  }
}
