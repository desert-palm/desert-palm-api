import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { User } from "./models/user.model";
import { UserInput } from "./models/userInput.model";
import { UsersService } from "./users.service";

@UseGuards(GqlAuthGuard)
@Resolver((_of: User) => User)
export class UsersResolver {
  constructor(private service: UsersService) {}

  @Query((_returns) => User)
  async user(@Args("id", { type: () => ID }) id: number) {
    return this.service.getUserById(id);
  }

  @Query((_returns) => [User])
  async users() {
    return this.service.getUsers();
  }

  @Mutation(() => User)
  async createUser(@Args("userData") userData: UserInput) {
    return this.service.createUser(userData);
  }

  @Mutation(() => User)
  async updateUser(@Args("userData") { id, ...data }: UserInput) {
    return this.service.updateUser(id, data);
  }

  @Mutation((_returns) => Boolean)
  async deleteUser(@Args("id", { type: () => ID }) id: number) {
    return this.service.deleteUser(id);
  }
}
