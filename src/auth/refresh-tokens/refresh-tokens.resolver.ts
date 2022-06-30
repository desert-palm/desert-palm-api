import { UseGuards } from "@nestjs/common";
import {
  Context,
  GqlExecutionContext,
  Mutation,
  Query,
  Resolver,
} from "@nestjs/graphql";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh-auth.guard";
import { AuthPayload } from "../models/auth.payload";
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

  @UseGuards(JwtRefreshAuthGuard)
  @Mutation(() => AuthPayload)
  async refreshToken(@Context() context: RefreshTokenContext) {
    return this.refreshTokensService.refreshToken(context.req.user);
  }

  // TODO: Remove when no longer needed for testing
  @Query(() => [RefreshToken])
  async refreshTokens() {
    return this.refreshTokensService.getRefreshTokens();
  }
}
