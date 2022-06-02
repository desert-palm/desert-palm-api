import { Args, Int, Query, Resolver, Mutation } from "@nestjs/graphql";
import { Product } from "./models/product.model";
import { ProductInput } from "./models/productInput.model";
import { ProductsService } from "./products.service";

@Resolver((_of: Product) => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Query((_returns) => Product)
  async getProduct(@Args("id", { type: () => Int }) id: number) {
    return this.productsService.getProduct(id);
  }

  @Query((_returns) => [Product])
  async getProducts() {
    return this.productsService.getProducts();
  }

  @Mutation(() => Product)
  async createProduct(@Args("productData") productData: ProductInput) {
    return this.productsService.createProduct(productData);
  }
}
