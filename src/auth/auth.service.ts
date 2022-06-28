import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { compare } from "bcrypt";
import { TokenExpiredError } from "jsonwebtoken";
import { Repository } from "typeorm";
import { User } from "../users/models/user.model";
import { UsersService } from "../users/users.service";
import { AuthPayload } from "./models/auth.payload";
import { RefreshToken } from "./models/refresh-token.model";
import { RefreshTokenPayload } from "./models/refresh-token.payload";

export const ACCESS_TOKEN_EXPIRES_IN = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,

    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.usersService.getUser({ where: { email } });
    const passwordMatch = await compare(password, user.password);

    if (user && passwordMatch) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async login({ id, email }: Partial<User>): Promise<AuthPayload> {
    const expires_in = 60 * 60 * 24 * 30;
    const access_token = await this.generateAccessToken(id, email);
    const refresh_token = await this.generateRefreshToken(id, expires_in);

    return {
      access_token,
      refresh_token,
      expires_in,
    };
  }

  async generateAccessToken(userId: number, email: string) {
    const payload = { email, sub: userId };

    // TODO: Increase expires_in duration after finished with testing
    return this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  async refreshToken(): Promise<RefreshTokenPayload> {
    const access_token = await this.jwtService.signAsync(
      {},
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );
    return { access_token };
  }

  async createRefreshToken(userId: number, ttl: number) {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl);

    const token = this.refreshTokenRepository.create({
      user: { id: userId },
      expires: expiration,
    });

    return this.refreshTokenRepository.save(token);
  }

  async generateRefreshToken(userId: number, expiresIn: number) {
    const payload = { sub: String(userId) };
    const token = await this.createRefreshToken(userId, expiresIn);
    return this.jwtService.signAsync({
      ...payload,
      expiresIn,
      jwtId: String(token.id),
    });
  }

  async resolveRefreshToken(encoded: string) {
    try {
      const payload = await this.jwtService.verify(encoded);

      if (!payload.sub || !payload.jwtId) {
        throw new UnprocessableEntityException("Refresh token malformed");
      }

      const token = await this.refreshTokenRepository.findOne({
        where: { id: payload.jwtId },
      });

      if (!token) {
        throw new UnprocessableEntityException("Refresh token not found");
      }

      if (token.revoked) {
        throw new UnprocessableEntityException("Refresh token revoked");
      }

      const user = await this.usersService.getUserById(payload.subject);

      if (!user) {
        throw new UnprocessableEntityException("Refresh token malformed");
      }

      return { user, token };
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException("Refresh token expired");
      } else {
        throw new UnprocessableEntityException("Refresh token malformed");
      }
    }
  }

  async createAccessTokenFromRefreshToken(
    refreshToken: string
  ): Promise<RefreshTokenPayload> {
    const { user } = await this.resolveRefreshToken(refreshToken);
    const access_token = await this.generateAccessToken(user.id, user.email);
    return { access_token };
  }
}
