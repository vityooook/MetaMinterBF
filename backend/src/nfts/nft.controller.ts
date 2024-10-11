import { Controller, Post, Body, Param, Get, UseGuards } from "@nestjs/common";
import { NftService } from "./nft.service";
import { CollectionDto } from "./dto/create.dto";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/auth/auth.guard";
import { PublishDto } from "./dto/publish.dto";

@UseGuards(JwtAuthGuard)
@Controller("api/collections")
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Post("/create")
  async createCollection(
    @Body() createCollectionDto: CollectionDto,
    @CurrentUser() currentUser,
  ) {
    return await this.nftService.createCollection(
      createCollectionDto,
      currentUser,
    );
  }

  @Post("/publish")
  async publishCollection(@Body() data: PublishDto) {
    return await this.nftService.publishCollection(data.id, data.address);
  }

  @Get(":id")
  async getCollectionById(@Param("id") id: string) {
    return await this.nftService.findCollectionById(id);
  }

  @Get("/check/:id")
  async checkIsCollectionDeployed(@Param("id") id: string) {
    return await this.nftService.checkIsCollectionDeployed(id);
  }

  @Get("")
  async findUserCollections(@CurrentUser() currentUser) {
    return await this.nftService.findUserCollections(currentUser);
  }
}
