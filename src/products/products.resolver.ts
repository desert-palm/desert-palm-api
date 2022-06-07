import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Product } from "./models/product.model";
import { ProductInput } from "./models/productInput.model";
import { ProductsService } from "./products.service";

@Resolver((_of: Product) => Product)
export class ProductsResolver {
  constructor(private service: ProductsService) {}

  @Query((_returns) => Product)
  async product(@Args("id", { type: () => ID }) id: number) {
    return this.service.getProduct(id, true);
  }

  @Query((_returns) => [Product])
  async products() {
    return this.service.getProducts(true);
  }

  @Mutation(() => Product)
  async createProduct(@Args("productData") productData: ProductInput) {
    return this.service.createProduct(productData);
  }

  @Mutation(() => Product)
  async updateProduct(@Args("productData") { id, ...data }: ProductInput) {
    return this.service.updateProduct(id, data);
  }

  @Mutation((_returns) => Boolean)
  async deleteProduct(@Args("id", { type: () => ID }) id: number) {
    return this.service.deleteProduct(id);
  }
}
