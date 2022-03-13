import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";
import { compare } from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.usersService.getUser({ where: { email } });
    const passwordMatch = await compare(password, user.password);

    if (user && passwordMatch) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async login({ id, email }: Partial<User>) {
    const payload = { email, sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
