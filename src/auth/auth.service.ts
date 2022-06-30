import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { User } from "../users/models/user.model";
import { UsersService } from "../users/users.service";
import { AuthPayload } from "./models/auth.payload";
import { RefreshTokensService } from "./refresh-tokens/refresh-tokens.service";

export interface RefreshTokenPayload {
  userId: number;
  refreshTokenId: number;
}

// TODO: Increase expires_in duration after finished with testing
const ACCESS_TOKEN_EXPIRES_IN = 10;

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => RefreshTokensService))
    private refreshTokensService: RefreshTokensService,

    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(userId: number): Promise<AuthPayload> {
    const expires_in = 60 * 60 * 24 * 30;
    const access_token = await this.generateAccessToken(userId);
    const { refresh_token } =
      await this.refreshTokensService.generateRefreshToken(userId, expires_in);
    return { access_token, refresh_token, expires_in };
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
