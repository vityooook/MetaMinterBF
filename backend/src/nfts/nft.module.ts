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
import { Link, LinkSchema } from './entities/link.entity';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NftCollection.name, schema: NftCollectionSchema },
    ]),
    MongooseModule.forFeature([{ name: NftItem.name, schema: NftItemSchema }]),
    MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
    HttpModule,
    FileModule,
    UsersModule,
  ],
  controllers: [NftController],
  providers: [BotService, NftService],
})
export class NftModule {}
