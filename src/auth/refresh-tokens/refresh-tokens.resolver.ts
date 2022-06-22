import { UseGuards, UseInterceptors } from "@nestjs/common";
import {
  Context,
  GqlExecutionContext,
  Mutation,
  Resolver,
} from "@nestjs/graphql";
import { SetAuthCookieInterceptor } from "../interceptors/set-auth-cookie.interceptor";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh-auth.guard";
import { RefreshToken } from "./models/refresh-token.model";
import {
  RefreshTokenPayload,
  RefreshTokensService,
} from "./refresh-tokens.service";

interface RefreshTokenContext extends GqlExecutionContext {
  req: {
    user: RefreshTokenPayload;
  };
}

@Resolver((_of: RefreshToken) => RefreshToken)
export class RefreshTokensResolver {
  constructor(private refreshTokensService: RefreshTokensService) {}

  @Mutation(() => Boolean)
  @UseGuards(JwtRefreshAuthGuard)
  @UseInterceptors(SetAuthCookieInterceptor)
  async refreshToken(@Context() context: RefreshTokenContext) {
    return this.refreshTokensService.refreshToken(context.req.user);
  }
}
