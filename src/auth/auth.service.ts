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

export interface RefreshTokenContents {
  userId: string;
  refreshTokenId: string;
}

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

  async login({ id }: Partial<User>): Promise<AuthPayload> {
    const expires_in = 60 * 60 * 24 * 30;
    const access_token = await this.generateAccessToken(id);
    const refresh_token = await this.generateRefreshToken(id, expires_in);

    return {
      access_token,
      refresh_token,
      expires_in,
    };
  }

  async refreshToken({
    userId,
    refreshTokenId,
  }: RefreshTokenContents): Promise<RefreshTokenPayload> {
    const { user } = await this.validateRefreshToken(userId, refreshTokenId);
    const access_token = await this.generateAccessToken(user.id);
    return { access_token };
  }

  async validateRefreshToken(userId: string, refreshTokenId: string) {
    try {
      const token = await this.refreshTokenRepository.findOne({
        where: { id: parseInt(refreshTokenId) },
      });

      if (!token) {
        throw new UnprocessableEntityException("Refresh token not found");
      }

      if (token.revoked) {
        throw new UnprocessableEntityException("Refresh token revoked");
      }

      const user = await this.usersService.getUserById(parseInt(userId));

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

  async generateAccessToken(userId: number) {
    const payload = { sub: userId };

    // TODO: Increase expires_in duration after finished with testing
    return this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
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
    const token = await this.createRefreshToken(userId, expiresIn);
    const payload = { sub: String(userId), jti: String(token.id) };
    return this.jwtService.signAsync({
      ...payload,
      expiresIn,
    });
  }
}
