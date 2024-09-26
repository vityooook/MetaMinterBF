import { UsersService } from './../users/users.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NftCollection } from './entities/nft-collection.entity';
import { User } from '../users/entities/user.entity';
import { CreateNftCollectionDto } from './dto/create-nft-collection.dto';
import { NftItem } from './entities/nft-item.entity';
import { Link } from './entities/link.entity';
import { nanoid } from 'nanoid';
import { createWriteStream, promises as fsPromises } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pump = promisify(pipeline);

@Injectable()
export class NftService {
  constructor(
    @InjectModel(NftCollection.name)
    private readonly collectionModel: Model<NftCollection>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(NftItem.name) private readonly itemModel: Model<NftItem>,
    @InjectModel(Link.name) private readonly linkModel: Model<Link>,
    private readonly usersService: UsersService,
  ) {}

  private allowedMimeTypes = {
    'image/jpeg': '.jpeg',
    'image/png': '.png',
  };

  async createCollection(
    createCollectionDto: CreateNftCollectionDto,
    user: User,
  ) {
    const filesFolder = nanoid(2);
    const hash = nanoid(16);

    await this.createDirectory(`./public/images/${filesFolder}`);

    // for await (const part of data) {
    //   if (part.type === 'file') {
    //     await this.handleFileUpload(part, filesFolder, hash, textFields);
    //   } else {
    //     this.handleField(part, textFields, linksRaw);
    //   }
    // }

    const nftCollection: Partial<NftCollection> = {
      title: createCollectionDto.collection_name,
      description: createCollectionDto.collection_description,
      image: createCollectionDto.collection_image,
      hash,
      items_limit: createCollectionDto.items_limit,
      owner_id: user._id,
      links: createCollectionDto.links,
    };

    const nftItem: Partial<NftItem> = {
      title: createCollectionDto.item_name,
      description: createCollectionDto.item_description,
      image: createCollectionDto.item_description,
      price: createCollectionDto.item_price,
    };

    const newCollection = new this.collectionModel(nftCollection);
    const newNftItem = new this.collectionModel(nftItem);

    return {
      status: 'ok',
      hash,
    };
  }

  private async createDirectory(path: string) {
    await fsPromises.mkdir(path, { mode: '0744', recursive: true });
  }

  private async handleFileUpload(
    part: any,
    filesFolder: string,
    hash: string,
    textFields: any,
  ) {
    const mimetype = part.mimetype;

    if (!(mimetype in this.allowedMimeTypes)) {
      throw new BadRequestException('The mimetype is not allowed');
    }

    const imgType =
      part.fieldname === 'collection_image' ? 'collection' : 'item';
    const newFilename = `${filesFolder}${hash}_${imgType}${this.allowedMimeTypes[mimetype]}`;
    textFields[`${imgType}_image`] = newFilename;

    await pump(
      part.file,
      createWriteStream(`./public/images/${filesFolder}/${newFilename}`),
    );
  }

  private handleField(part: any, textFields: any, linksRaw: any[]) {
    if (part.fieldname.startsWith('link_')) {
      linksRaw.push(JSON.parse(part.value));
    } else {
      textFields[part.fieldname] = part.value;
    }
  }

  async findCollectionByHash(hash: string) {
    const collection = await this.collectionModel.findOne({ hash });
    if (!collection || !collection.deployed) {
      throw new NotFoundException('Collection not found');
    }
    return collection;
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
