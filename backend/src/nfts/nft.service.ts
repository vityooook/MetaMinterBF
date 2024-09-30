import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NftCollection } from './entities/nft-collection.entity';
import { User } from '../users/entities/user.entity';
import { CreateNftCollectionDto } from './dto/create-nft-collection.dto';
import { NftItem } from './entities/nft-item.entity';
import { nanoid } from 'nanoid';

@Injectable()
export class NftService {
  constructor(
    @InjectModel(NftCollection.name)
    private readonly collectionModel: Model<NftCollection>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(NftItem.name) private readonly itemModel: Model<NftItem>,
  ) {}

  async createCollection(
    createCollectionDto: CreateNftCollectionDto,
    user: User,
    uploadedFiles: any[],
  ) {
    const hash = nanoid(16);

    const nftCollection: Partial<NftCollection> = {
      title: createCollectionDto.collection_name,
      description: createCollectionDto.collection_description,
      hash,
      items_limit: createCollectionDto.items_limit,
      owner_id: user._id,
      links: createCollectionDto.links,
      image: uploadedFiles.find((file) => file.fieldname === 'collection_image')
        ?.path,
    };

    const nftItem: Partial<NftItem> = {
      title: createCollectionDto.item_name,
      description: createCollectionDto.item_description,
      price: createCollectionDto.item_price,
      image: uploadedFiles.find((file) => file.fieldname === 'item_image')
        ?.path,
    };

    const newCollection = new this.collectionModel(nftCollection);
    const newNftItem = new this.collectionModel(nftItem);

    return {
      status: 'ok',
      hash,
    };
  }

  async findNftCollectionByHash(hash: string) {
    const collection = await this.collectionModel.findOne({ hash });
    if (!collection || !collection.deployed) {
      throw new NotFoundException('Collection not found');
    }
    return collection;
  }

  async findNftItemByHash(hash: string) {
    const nft = await this.itemModel.findOne({ hash });
    return nft;
  }

  async findUserCollections(userId: number) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) return [];
    return await this.collectionModel
      .find({ owner_id: user.id })
      .populate('items')
      .exec();
  }
}
