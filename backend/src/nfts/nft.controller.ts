import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { NftService } from './nft.service';
import { CreateNftCollectionDto } from './dto/create-nft-collection.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/collections')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Post('/create')
  async createCollection(
    @Body() createCollectionDto: CreateNftCollectionDto,
    @CurrentUser() currentUser,
  ) {
    return await this.nftService.createCollection(
      createCollectionDto,
      currentUser,
    );
  }

  @Get(':hash')
  async findCollectionByHash(@Param('hash') hash: string) {
    return await this.nftService.findCollectionByHash(hash);
  }

  @Get('')
  async findUserCollections(@CurrentUser() currentUser) {
    return await this.nftService.findUserCollections(currentUser);
  }
}
