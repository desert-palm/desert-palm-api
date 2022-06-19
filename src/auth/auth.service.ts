import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { compare } from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "./entities/refresh-token.entity";
import { Repository } from "typeorm";
import { TokenExpiredError } from "jsonwebtoken";
import { User } from "../users/models/user.model";

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

  async login({ id, email }: Partial<User>) {
    const payload = { email, sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateAccessToken(userId: number) {
    const payload = { sub: String(userId) };
    return await this.jwtService.signAsync(payload);
  }

  // TODO: Uncomment when ready to implement refresh tokens
  // async createRefreshToken(userId: number, ttl: number) {
  //   const expiration = new Date();
  //   expiration.setTime(expiration.getTime() + ttl);

  //   const token = this.refreshTokenRepository.create({
  //     user: { id: userId },
  //     expires: expiration,
  //   });

  //   return await this.refreshTokenRepository.save(token);
  // }

  // async generateRefreshToken(userId: number, expiresIn: number) {
  //   const payload = { sub: String(userId) };
  //   const token = await this.createRefreshToken(userId, expiresIn);
  //   return await this.jwtService.signAsync({
  //     ...payload,
  //     expiresIn,
  //     jwtId: String(token.id),
  //   });
  // }

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

  async createAccessTokenFromRefreshToken(refresh: string) {
    const { user } = await this.resolveRefreshToken(refresh);

    const token = await this.generateAccessToken(user.id);

    return { user, token };
  }
}
