import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { hash } from "bcrypt";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { GqlAuthGuard } from "./guards/gql-auth.guard";
import { AuthPayload } from "./models/auth.payload";
import { LoginInput } from "./models/login.input";
import { SignUpInput } from "./models/sign-up.input";

const SALT_ROUNDS = 10;

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

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

  @UseGuards(GqlAuthGuard)
  @Query(() => Boolean)
  async authCheck() {
    return true;
  }
}
