import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as session from "express-session";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(
    session({
      secret: process.env.EXPRESS_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Desert Palm API")
    .setDescription("E-commerce API built with NestJS and TypeORM")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.SERVER_PORT);
}

bootstrap();
