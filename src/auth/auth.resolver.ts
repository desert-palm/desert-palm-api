import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { hash } from "bcrypt";
import { UsersService } from "../users/users.service";
import { SALT_ROUNDS } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoginUserInput } from "./models/loginUser.input";
import { LoginUserPayload } from "./models/loginUser.payload";
import { SignUpInput } from "./models/signUp.input";
import { SignUpPayload } from "./models/signUp.payload";

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

  @Mutation(() => LoginUserPayload)
  async login(@Args("input") input: LoginUserInput) {
    // TODO: Remove when no longer needed for testing
    console.log(input);
  }

  // @Mutation(() => RefreshTokenPayload)
  // async refreshToken(@Args("input") input: RefreshTokenInput) {
  //   return this.authService.createAccessTokenFromRefreshToken(
  //     input.refreshToken
  //   );
  // }
}
