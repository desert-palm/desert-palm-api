import { Args, Int, Query, Resolver, Mutation } from "@nestjs/graphql";
import { Product } from "./models/product.model";
import { ProductInput } from "./models/productInput.model";
import { ProductsService } from "./products.service";

@Resolver((_of: Product) => Product)
export class ProductsResolver {
  constructor(private service: ProductsService) {}

  @Query((_returns) => Product)
  async product(@Args("id", { type: () => Int }) id: number) {
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
}
