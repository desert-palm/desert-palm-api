import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async getUser(options: FindOneOptions<User>) {
    return this.usersRepository.findOne(options);
  }

  async getUserById(id: number) {
    const { password: _password, ...rest } = await this.usersRepository.findOne(
      { where: { id } }
    );
    return rest;
  }

  async getUsers() {
    return this.usersRepository.find();
  }

  async createUser(data: Partial<User>) {
    return this.usersRepository.save(data);
  }

  async updateUser(userId: number, data: Partial<User>) {
    return this.usersRepository.update(userId, data);
  }

  async deleteUser(userId: number) {
    return this.usersRepository.delete(userId);
  }
}
