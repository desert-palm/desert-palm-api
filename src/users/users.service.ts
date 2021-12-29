import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DeleteResult,
  FindOneOptions,
  Repository,
  UpdateResult,
} from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async getUser(options: FindOneOptions<User>): Promise<User | null> {
    return this.usersRepository.findOne(options);
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async createUser(data: Partial<User>): Promise<User> {
    return this.usersRepository.save(data);
  }

  async updateUser(userId: string, data: Partial<User>): Promise<UpdateResult> {
    return this.usersRepository.update(userId, data);
  }

  async deleteUser(userId: string): Promise<DeleteResult> {
    return this.usersRepository.delete(userId);
  }
}
