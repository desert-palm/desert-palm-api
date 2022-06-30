import { UseGuards } from "@nestjs/common";
import {
  Args,
  Context,
  GqlExecutionContext,
  Mutation,
  Query,
  Resolver,
} from "@nestjs/graphql";
import { hash } from "bcrypt";
import { UsersService } from "../users/users.service";
import { AuthService, RefreshTokenPayload } from "./auth.service";
import { GqlAuthGuard } from "./guards/gql-auth.guard";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh-auth.guard";
import { AuthPayload } from "./models/auth.payload";
import { LoginInput } from "./models/login.input";
import { RefreshToken } from "./models/refresh-token.model";
import { SignUpInput } from "./models/sign-up.input";

interface RefreshTokenContext extends GqlExecutionContext {
  req: {
    user: RefreshTokenPayload;
  };
}

const SALT_ROUNDS = 10;

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => Boolean)
  async authCheck() {
    return true;
  }

  // TODO: Remove when no longer needed for testing
  @Query(() => [RefreshToken])
  async refreshTokens() {
    return this.authService.getRefreshTokens();
  }

  @Mutation(() => AuthPayload)
  async login(@Args("input") { email, password }: LoginInput) {
    const user = await this.authService.validateUser(email, password);
    return this.authService.login(user.id);
  }

  @Mutation(() => AuthPayload)
  async signUp(@Args("input") { password, ...rest }: SignUpInput) {
    const passwordHash = await hash(password, SALT_ROUNDS);
    const user = await this.usersService.createUser({
      ...rest,
      password: passwordHash,
    });
    return this.authService.login(user.id);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Mutation(() => AuthPayload)
  async refreshToken(@Context() context: RefreshTokenContext) {
    return this.authService.refreshToken(context.req.user);
  }
}
