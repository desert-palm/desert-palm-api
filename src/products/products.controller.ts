import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UploadImages } from "../images/decorators/uploadImages.decorator";
import { CreateProductDto } from "./dto/createProduct.dto";
import { UpdateProductDto } from "./dto/updateProduct.dto";
import { ProductsService } from "./products.service";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get(":productId")
  async getProduct(@Param("productId", ParseIntPipe) productId: number) {
    return this.service.getProduct(productId, true);
  }

  @Get()
  async getProducts() {
    return this.service.getProducts(true);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(@Body() body: CreateProductDto) {
    return this.service.createProduct(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":productId")
  async updateProduct(
    @Param("productId", ParseIntPipe) productId: number,
    @Body() body: UpdateProductDto
  ) {
    return this.service.updateProduct(productId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":productId")
  async deleteProduct(@Param("productId", ParseIntPipe) productId: number) {
    this.service.deleteProduct(productId);
  }

  @Post(":productId/upload-images")
  @UploadImages()
  async uploadProductImages(
    @Param("productId", ParseIntPipe) productId: number,
    @UploadedFiles() images: Express.Multer.File[]
  ) {
    return this.service.saveProductImages(productId, images);
  }
}
