import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { RefreshToken } from "./models/refresh-token.model";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
    }),
    TypeOrmModule.forFeature([RefreshToken]),
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtRefreshStrategy,
    JwtStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}
