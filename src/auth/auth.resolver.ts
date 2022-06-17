import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UserInputError } from "apollo-server-express";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { LoginUserInput } from "./models/loginUser.input";
import { LoginUserPayload } from "./models/loginUser.payload";
import { RefreshTokenInput } from "./models/refreshToken.input";
import { RefreshTokenPayload } from "./models/refreshToken.payload";
import { SignUpInput } from "./models/signUp.input";
import { SignUpPayload } from "./models/signUp.payload";

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Mutation(() => LoginUserPayload)
  async login(@Args("input") input: LoginUserInput) {
    const user = await this.authService.validateUser(
      input.username,
      input.password
    );

    if (!user) {
      return new UserInputError("Username or password incorrect.");
    }

    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(
      user.id,
      60 * 60 * 24 * 30
    );

    return { user, accessToken, refreshToken };
  }

  @Mutation(() => RefreshTokenPayload)
  async refreshToken(@Args("input") input: RefreshTokenInput) {
    return this.authService.createAccessTokenFromRefreshToken(
      input.refreshToken
    );
  }

  @Mutation(() => SignUpPayload)
  async signUp(@Args("input") { username, password }: SignUpInput) {
    const user = await this.usersService.createUser({
      name: username,
      password,
    });
    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(
      user.id,
      60 * 60 * 24 * 30
    );

    return { user, accessToken, refreshToken };
  }
}
