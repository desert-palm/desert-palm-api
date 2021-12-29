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

  async validateUser(name: string, password: string): Promise<Partial<User>> {
    const user = await this.usersService.getUser({ where: { name } });
    const passwordMatch = await compare(password, user.password);

    if (user && passwordMatch) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async login({ id, name }: Partial<User>): Promise<{ access_token: string }> {
    const payload = { username: name, sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
