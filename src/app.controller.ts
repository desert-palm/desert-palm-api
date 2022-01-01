import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("app")
@Controller()
export class AppController {
  @Get()
  getWelcome() {
    return `Welcome to Desert Palm API — ${new Date().toISOString()}`;
  }
}
