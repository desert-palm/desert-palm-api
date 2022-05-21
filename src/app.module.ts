import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { ImagesModule } from "./images/images.module";
import ormconfig from "./ormconfig";
import { ProductsModule } from "./products/products.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    ProductsModule,
    UsersModule,
    ImagesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
