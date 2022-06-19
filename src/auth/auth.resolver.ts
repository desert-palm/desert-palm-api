import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { hash } from "bcrypt";
import { UsersService } from "../users/users.service";
import { SALT_ROUNDS } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GqlAuthGuard } from "./guards/gql-auth.guard";
import { LoginInput } from "./models/login.input";
import { LoginPayload } from "./models/login.payload";
import { SignUpInput } from "./models/sign-up.input";
import { SignUpPayload } from "./models/sign-up.payload";

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Mutation(() => SignUpPayload)
  async signUp(@Args("input") { password, ...rest }: SignUpInput) {
    const passwordHash = await hash(password, SALT_ROUNDS);
    const user = await this.usersService.createUser({
      ...rest,
      password: passwordHash,
    });

    return this.authService.login(user);
  }

  @Mutation(() => LoginPayload)
  async login(@Args("input") { email, password }: LoginInput) {
    const user = await this.authService.validateUser(email, password);
    return this.authService.login(user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Boolean)
  async authCheck() {
    return true;
  }

  // TODO: Uncomment when ready to implement refresh tokens
  // @Mutation(() => RefreshTokenPayload)
  // async refreshToken(@Args("input") input: RefreshTokenInput) {
  //   return this.authService.createAccessTokenFromRefreshToken(
  //     input.refreshToken
  //   );
  // }
}
