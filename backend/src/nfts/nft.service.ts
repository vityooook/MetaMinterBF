import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NftCollection } from "./entities/nft-collection.entity";
import { User } from "../users/entities/user.entity";
import { NftCollectionDto } from "./dto/nft-collection";
import { NftItem } from "./entities/nft-item.entity";
import { toNano, address } from "@ton/core";
import { generateNftCollectionPayload } from "./nft.helper";
import {
  MASTER_ADDRESS,
  NFT_COLLECTION_CODE_HEX,
  NFT_COMMISSION,
  NFT_ITEM_CODE_HEX,
} from "./nft.constants";

@Injectable()
export class NftService {
  constructor(
    @InjectModel(NftCollection.name)
    private readonly collectionModel: Model<NftCollection>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(NftItem.name) private readonly itemModel: Model<NftItem>,
  ) {}

  async createCollection(
    createCollectionDto: NftCollectionDto,
    files: { [key: string]: Express.Multer.File[] },
    user: User,
  ) {
    const savedNftItems = await Promise.all(
      createCollectionDto.items.map(async (item, index) => {
        const nftItem: Partial<NftItem> = {
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: files["items.image"]?.[index]?.path,
        };

        const newNftItem = new this.itemModel(nftItem);

        return await newNftItem.save();
      }),
    );

    const collectionImagePath = files["image"]?.[0]?.path;

    const collectionData: Partial<NftCollection> = {
      name: createCollectionDto.name,
      description: createCollectionDto.description,
      itemsLimit: createCollectionDto.itemsLimit,
      ownerId: user._id,
      links: createCollectionDto.links,
      items: savedNftItems.map((item) => item._id.toString()),
      imageUrl: collectionImagePath,
      startTime: createCollectionDto.startTime,
      endTime: createCollectionDto.endTime,
    };

    const newCollection = new this.collectionModel(collectionData);

    await newCollection.save();

    await this.userModel.updateOne(
      { _id: user._id },
      {
        $set: { isNewUser: false },
      },
    );

    const response = {
      ...newCollection,
      deployed: true,
      items: savedNftItems.map((item) => ({
        _id: item._id.toString(),
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
      })),
    };

    return response;
  }

  async findNftCollectionById(id: string) {
    const collection = await this.collectionModel.findOne({ _id: id }).populate('items');
    return collection;
  }

  async findNftItemById(id: string) {
    const nft = await this.itemModel.findOne({ _id: id }).exec();
    return nft;
  }

  async findUserCollections(userId: number) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) return [];
    return await this.collectionModel
      .find({ ownerId: user._id })
      .populate("items")
      .sort({ updatedAt: -1 })
      .exec();
  }

  async generateCollectionPayload(collectionId: string, userAddress: string) {
    const collection = await this.findNftCollectionById(collectionId);
    if (!collection) {
      throw new Error("Collection not found");
    }

    const item = await this.findNftItemById(collection.items[0]);
    if (!item) {
      throw new Error("NFT item not found in the collection");
    }

    const payload = await generateNftCollectionPayload({
      nftCollectionCodeHex: NFT_COLLECTION_CODE_HEX,
      nftItemCodeHex: NFT_ITEM_CODE_HEX,
      admin: address(MASTER_ADDRESS),
      userOwner: address(userAddress),
      price: toNano(item.price),
      buyerLimit: collection.itemsLimit,
      startTime: Math.floor(Number(collection.startTime) / 1000),
      endTime: Math.floor(Number(collection.endTime) / 1000),
      collectionContent: `${process.env.APP_URL}/api/metadata/collection/${collection._id}.json`,
      itemContent: `${process.env.APP_URL}/api/metadata/nft/`,
      itemContentJson: `${item._id}.json`,
      commission: NFT_COMMISSION,
    });

    const collectionAddress = payload.address.toString();

    await this.collectionModel.updateOne(
      { _id: collectionId },
      { $set: { address: collectionAddress } },
    );

    return {
      stateInit: payload.stateInitBase64,
      address: collectionAddress,
      amount: Number(NFT_COMMISSION),
    };
  }

  async publishCollection(collectionId: string) {
    const collection = await this.findNftCollectionById(collectionId);
    if (!collection) {
      throw new Error("Collection not found");
    }

    return await this.collectionModel.updateOne(
      { _id: collectionId },
      { $set: { deployed: true } },
    );
  }

  async collectionMetadataJson(id: string) {
    const metadata = await this.collectionModel.findOne({ _id: id });

    const result = {
      name: metadata?.name,
      description: metadata?.description,
      image: process.env.APP_URL + "/" + metadata?.imageUrl.replace(/\\/g, "/"),
    };

    return result;
  }

  async nftMetadataJson(id: string) {
    const metadata = await this.itemModel.findOne({ _id: id });

    const result = {
      name: metadata?.name,
      description: metadata?.description,
      image: process.env.APP_URL + "/" + metadata?.imageUrl.replace(/\\/g, "/"),
    };

    return result;
  }
}
