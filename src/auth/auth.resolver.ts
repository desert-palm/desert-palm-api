import { UseGuards, UseInterceptors } from "@nestjs/common";
import {
  Args,
  Context,
  GqlExecutionContext,
  Mutation,
  Query,
  Resolver,
} from "@nestjs/graphql";
import { Request } from "express";
import { User } from "../users/models/user.model";
import { AuthService } from "./auth.service";
import { GqlAuthGuard } from "./guards/gql-auth.guard";
import { ClearAuthCookieInterceptor } from "./interceptors/clear-auth-cookie.interceptor";
import { SetAuthCookieInterceptor } from "./interceptors/set-auth-cookie.interceptor";
import { LoginInput } from "./models/login.input";
import { SignUpInput } from "./models/sign-up.input";

interface AuthContext extends GqlExecutionContext {
  req: {
    user: User;
  } & Request;
}

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Boolean)
  @UseInterceptors(SetAuthCookieInterceptor)
  async login(@Args("input") input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => Boolean)
  @UseInterceptors(SetAuthCookieInterceptor)
  async signUp(@Args("input") input: SignUpInput) {
    return this.authService.signUp(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  @UseInterceptors(ClearAuthCookieInterceptor)
  async logOut(@Context() context: AuthContext) {
    return this.authService.logOut(context.req.user.id);
  }

  @Query(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async authCheck() {
    return true;
  }
}
