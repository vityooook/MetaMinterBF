import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { BotService } from "./bot/bot.service";
import { NftService } from "./nfts/nft.service";

@Controller("api")
export class AppController {
  constructor(
    private readonly nftService: NftService,
    private readonly botService: BotService,
  ) {
    // this.botService.launch();
  }

  @Get("/metadata/collection/:id.json")
  async getCollectionMetadata(@Param("id") id: string, @Res() res) {
    const metadata = await this.nftService.collectionMetadataJson(id);

    res.set({
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename=${id}.json`,
    });

    return res.json(metadata);
  }

  @Get("/metadata/nft/:id.json")
  async nftMetadataJson(@Param("id") id: string, @Res() res) {
    const metadata = await this.nftService.nftMetadataJson(id);

    res.set({
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename=${id}.json`,
    });

    return res.json(metadata);
  }
}
