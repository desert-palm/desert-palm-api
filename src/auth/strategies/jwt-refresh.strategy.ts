import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwtRefresh"
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { email: string; sub: string; jwtId: string }) {
    return { email: payload.email, userId: payload.sub, jwtId: payload.jwtId };
  }
}
