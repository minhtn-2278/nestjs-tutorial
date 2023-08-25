import { Controller, Get } from "@nestjs/common";

@Controller('/app')
export class AppController {
  @Get('/abc')
  getRootRoute() {
    return 'Hello World';
  }
}
