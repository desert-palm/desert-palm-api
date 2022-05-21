import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./product.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>
  ) {}

  async getProduct(productId: number) {
    return this.repository.findOne(productId);
  }

  async getProducts() {
    return this.repository.find();
  }

  async createProduct(data: Partial<Product>) {
    return this.repository.save(data);
  }

  async updateProduct(productId: number, data: Partial<Product>) {
    await this.repository.update(productId, data);
    return this.repository.findOne(productId);
  }

  async deleteProduct(productId: number) {
    return this.repository.delete(productId);
  }
}
