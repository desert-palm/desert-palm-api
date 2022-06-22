import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { User } from "../users/models/user.model";
import { UsersService } from "../users/users.service";
import { LoginInput } from "./models/login.input";
import { SignUpInput } from "./models/sign-up.input";
import { RefreshTokensService } from "./refresh-tokens/refresh-tokens.service";

const ACCESS_TOKEN_EXPIRES_IN = 60 * 60;
const SALT_ROUNDS = 10;

export interface AuthCookiePayload {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => RefreshTokensService))
    private refreshTokensService: RefreshTokensService,

    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login({ email, password }: LoginInput) {
    const user = await this.validateUser(email, password);
    return this.generateTokens(user.id);
  }

  async signUp({ password, ...rest }: SignUpInput) {
    const passwordHash = await hash(password, SALT_ROUNDS);
    const user = await this.usersService.createUser({
      password: passwordHash,
      ...rest,
    });
    return this.generateTokens(user.id);
  }

  async logOut(userId: number) {
    await this.refreshTokensService.revokeAllRefreshTokensForUser(userId);
    return true;
  }

  async generateTokens(userId: number): Promise<AuthCookiePayload> {
    const access_token = await this.generateAccessToken(userId);
    const { refresh_token } =
      await this.refreshTokensService.generateRefreshToken(userId);
    return {
      access_token,
      refresh_token,
    };
  }

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.usersService.getUser({ where: { email } });
    const passwordMatch = await compare(password, user.password);

    if (user && passwordMatch) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async generateAccessToken(userId: number) {
    const payload = { sub: userId };
    return this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  }
}
