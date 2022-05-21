import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Image } from "./image.entity";
import { deleteImage } from "./image.utils";

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private repository: Repository<Image>
  ) {}

  async getImage(imageId: number) {
    return this.repository.findOne(imageId);
  }

  async getImages() {
    return this.repository.find();
  }

  async createImage(data: Partial<Image>) {
    return this.repository.save(data);
  }

  async saveImages(images: Express.Multer.File[]) {
    const savedImages = [];

    for (const { filename } of images) {
      const image = await this.createImage({ filename });
      savedImages.push(image);
    }

    return savedImages;
  }

  async deleteImage(imageId: number) {
    const { filename } = await this.getImage(imageId);
    await deleteImage(filename);

    return this.repository.delete(imageId);
  }
}
