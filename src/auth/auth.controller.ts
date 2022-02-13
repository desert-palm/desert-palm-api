import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Session,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { hash } from "bcrypt";
import { Request } from "express";
import { SessionData } from "express-session";
import { CreateUserDto } from "../users/dto/createUser.dto";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { LocalAuthGuard } from "./local-auth.guard";

interface AuthSession extends SessionData {
  access_token: string;
}

const SALT_ROUNDS = 10;

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("session")
  async getAuthSession(@Session() session: AuthSession) {
    return session;
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req: Request, @Session() session: AuthSession) {
    const result = await this.authService.login(req.user);
    session.access_token = result.access_token;

    return result;
  }

  @Post("signup")
  async signUp(@Body() body: CreateUserDto, @Session() session: AuthSession) {
    const { password, ...rest } = body;
    const passwordHash = await hash(password, SALT_ROUNDS);

    const user = await this.usersService.createUser({
      ...rest,
      password: passwordHash,
    });
    const loginResult = await this.authService.login(user);

    session.access_token = loginResult.access_token;

    return loginResult;
  }

  @Post("logout")
  async logout(@Session() session: AuthSession) {
    session.access_token = null;
  }
}
