import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NftController } from './nft.controller';
import {
  NftCollection,
  NftCollectionSchema,
} from './entities/nft-collection.entity';
import { HttpModule } from '@nestjs/axios';
import { BotService } from '../bot/bot.service';
import { UsersModule } from '../users/users.module';
import { NftService } from './nft.service';
import { NftItem, NftItemSchema } from './entities/nft-item.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NftCollection.name, schema: NftCollectionSchema },
    ]),
    MongooseModule.forFeature([{ name: NftItem.name, schema: NftItemSchema }]),
    HttpModule,
    UsersModule,
  ],
  controllers: [NftController],
  providers: [BotService, NftService],
  exports: [NftService]
})
export class NftModule {}
