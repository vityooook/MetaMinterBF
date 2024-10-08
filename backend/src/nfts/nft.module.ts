import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NftController } from './nft.controller';
import {
  Collection,
  CollectionSchema,
} from './entities/collection.entity';
import { HttpModule } from '@nestjs/axios';
import { BotService } from '../bot/bot.service';
import { UsersModule } from '../users/users.module';
import { NftService } from './nft.service';
import { Nft, NftSchema } from './entities/nft.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
    ]),
    MongooseModule.forFeature([{ name: Nft.name, schema: NftSchema }]),
    HttpModule,
    UsersModule,
  ],
  controllers: [NftController],
  providers: [BotService, NftService],
  exports: [NftService]
})
export class NftModule {}
