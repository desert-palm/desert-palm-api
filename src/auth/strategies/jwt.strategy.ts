import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: JwtStrategy.extractJWT,
      secretOrKey: process.env.JWT_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: number }) {
    return this.usersService.getUserById(payload.sub);
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && "auth" in req.cookies) {
      return req.cookies.auth.access_token;
    }
    return null;
  }
}
