import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { deleteImage } from "../images/image.utils";
import { ImagesService } from "../images/images.service";
import { CreateProductDto } from "./dto/createProduct.dto";
import { UpdateProductDto } from "./dto/updateProduct.dto";
import { ProductInput } from "./models/productInput.model";
import { Product } from "./product.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,

    private readonly imagesService: ImagesService
  ) {}

  async getProduct(id: number, withImages?: boolean) {
    return this.repository.findOne({
      where: { id },
      relations: withImages ? ["images"] : [],
    });
  }

  async getProducts(withImages?: boolean) {
    return this.repository.find({ relations: withImages ? ["images"] : [] });
  }

  async createProduct(data: CreateProductDto | ProductInput) {
    return this.repository.save(data);
  }

  async updateProduct(productId: number, data: UpdateProductDto) {
    await this.repository.update(productId, data);
    return this.getProduct(productId, true);
  }

  async saveProductImages(productId: number, images: Express.Multer.File[]) {
    const savedImages = [];

    for (const { filename } of images) {
      const image = await this.imagesService.createImage({
        filename,
        productId,
      });
      savedImages.push(image);
    }

    return savedImages;
  }

  async deleteProduct(productId: number) {
    const { images } = await this.getProduct(productId, true);
    for (const { filename } of images) {
      await deleteImage(filename);
    }

    return this.repository.delete(productId);
  }
}
