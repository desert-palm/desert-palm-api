import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { TokenExpiredError } from "jsonwebtoken";
import { Not, Repository } from "typeorm";
import { UsersService } from "../../users/users.service";
import { AuthService } from "../auth.service";
import { AuthPayload } from "../models/auth.payload";
import { RefreshToken } from "./models/refresh-token.model";

export interface RefreshTokenPayload {
  userId: number;
  refreshTokenId: number;
}

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private repository: Repository<RefreshToken>,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,

    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async refreshToken({
    userId,
    refreshTokenId,
  }: RefreshTokenPayload): Promise<AuthPayload> {
    await this.validateRefreshToken(userId, refreshTokenId);

    const expires_in = 60 * 60 * 24 * 30;
    const access_token = await this.authService.generateAccessToken(userId);

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
      const token = await this.repository.findOne({
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

  async generateRefreshToken(userId: number, expiresIn: number) {
    const { id } = await this.createRefreshToken(userId, expiresIn);
    const payload = { jti: String(id), sub: String(userId) };
    const refresh_token = await this.jwtService.signAsync({
      ...payload,
      expiresIn,
    });
    return { refresh_token, id };
  }

  async createRefreshToken(userId: number, ttl: number) {
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + ttl);
    const token = this.repository.create({ expiresAt, userId });
    return this.repository.save(token);
  }

  async revokeAllRefreshTokensForUser(userId: number) {
    await this.repository.update(
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
    await this.repository.update(
      { id: Not(refreshTokenId), userId },
      {
        revoked: true,
      }
    );
  }

  // TODO: Remove when no longer needed for testing
  async getRefreshTokens() {
    return await this.repository.find({ relations: ["user"] });
  }
}
