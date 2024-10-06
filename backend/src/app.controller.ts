import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "./users/users.service";
import { BotService } from "./bot/bot.service";
import { JwtAuthGuard } from "src/auth/auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("api")
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly botService: BotService,
  ) {
    // this.botService.launch();
  }
}
