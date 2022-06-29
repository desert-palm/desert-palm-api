// TODO: Add refresh token module within auth

import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { compare } from "bcrypt";
import { TokenExpiredError } from "jsonwebtoken";
import { Not, Repository } from "typeorm";
import { User } from "../users/models/user.model";
import { UsersService } from "../users/users.service";
import { AuthPayload } from "./models/auth.payload";
import { RefreshToken } from "./models/refresh-token.model";

export interface RefreshTokenPayload {
  userId: number;
  refreshTokenId: number;
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

  async login(userId: number): Promise<AuthPayload> {
    const expires_in = 60 * 60 * 24 * 30;
    const access_token = await this.generateAccessToken(userId);
    const { refresh_token } = await this.generateRefreshToken(
      userId,
      expires_in
    );
    return { access_token, refresh_token, expires_in };
  }

  async refreshToken({
    userId,
    refreshTokenId,
  }: RefreshTokenPayload): Promise<AuthPayload> {
    await this.validateRefreshToken(userId, refreshTokenId);

    const expires_in = 60 * 60 * 24 * 30;
    const access_token = await this.generateAccessToken(userId);

    // Implements refresh token rotation - a new refresh token is issed on every refresh
    const { refresh_token, id } = await this.generateRefreshToken(
      userId,
      expires_in
    );

    // Revokes all refresh tokens for the user other than the one just created
    await this.revokeAllOtherRefreshTokensForUser(id, userId);

    return { access_token, refresh_token, expires_in };
  }

  async validateRefreshToken(userId: number, refreshTokenId: number) {
    try {
      const token = await this.refreshTokenRepository.findOne({
        where: { id: refreshTokenId },
      });

      if (!token) {
        throw new UnprocessableEntityException("Refresh token not found");
      }

      if (token.revoked) {
        /**
         * Helps to prevent Replay Attacks
         * https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation
         */
        await this.revokeAllRefreshTokensForUser(userId);

        throw new UnprocessableEntityException("Refresh token revoked");
      }

      const user = await this.usersService.getUserById(userId);

      if (!user) {
        throw new UnprocessableEntityException("Refresh token malformed");
      }

      return true;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException("Refresh token expired");
      } else {
        throw new UnprocessableEntityException(e.message);
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
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + ttl);
    const token = this.refreshTokenRepository.create({ expiresAt, userId });

    return this.refreshTokenRepository.save(token);
  }

  async generateRefreshToken(userId: number, expiresIn: number) {
    const { id } = await this.createRefreshToken(userId, expiresIn);
    const payload = { jti: String(id), sub: String(userId) };
    const refresh_token = await this.jwtService.signAsync({
      ...payload,
      expiresIn,
    });

    return { refresh_token, id };
  }

  async revokeAllRefreshTokensForUser(userId: number) {
    await this.refreshTokenRepository.update(
      { userId },
      {
        revoked: true,
      }
    );
  }

  async revokeAllOtherRefreshTokensForUser(
    refreshTokenId: number,
    userId: number
  ) {
    await this.refreshTokenRepository.update(
      { id: Not(refreshTokenId), userId },
      {
        revoked: true,
      }
    );
  }

  // TODO: Remove when no longer needed for testing
  async getRefreshTokens() {
    return await this.refreshTokenRepository.find({ relations: ["user"] });
  }
}
