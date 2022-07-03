import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwtRefresh"
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        JwtRefreshStrategy.extractJWT,
      ]),
      secretOrKey: process.env.JWT_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string; jti: string }) {
    return {
      refreshTokenId: parseInt(payload.jti),
      userId: parseInt(payload.sub),
    };
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && "auth" in req.cookies) {
      return req.cookies.auth.refresh_token;
    }
    return null;
  }
}
