import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { hash } from "bcrypt";
import { Request } from "express";
import { CreateUserDto } from "../users/dto/createUser.dto";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";

const SALT_ROUNDS = 10;

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post("signup")
  async signUp(@Body() body: CreateUserDto) {
    const { password, ...rest } = body;
    const passwordHash = await hash(password, SALT_ROUNDS);

    const user = await this.usersService.createUser({
      ...rest,
      password: passwordHash,
    });

    return this.authService.login(user);
  }
}
