import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { hash } from "bcrypt";
import { UsersService } from "../users/users.service";
import { SALT_ROUNDS } from "./auth.controller";
import { AuthService } from "./auth.service";
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

  // @Mutation(() => LoginUserPayload)
  // async login(@Args("input") input: LoginUserInput) {
  //   const user = await this.authService.validateUser(
  //     input.username,
  //     input.password
  //   );

  //   if (!user) {
  //     return new UserInputError("Username or password incorrect.");
  //   }

  //   const accessToken = await this.authService.generateAccessToken(user.id);
  //   const refreshToken = await this.authService.generateRefreshToken(
  //     user.id,
  //     60 * 60 * 24 * 30
  //   );

  //   return { user, accessToken, refreshToken };
  // }

  // @Mutation(() => RefreshTokenPayload)
  // async refreshToken(@Args("input") input: RefreshTokenInput) {
  //   return this.authService.createAccessTokenFromRefreshToken(
  //     input.refreshToken
  //   );
  // }
}
