import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Collection } from "./entities/collection.entity";
import { User } from "../users/entities/user.entity";
import { CollectionDto } from "./dto/create.dto";
import { Nft } from "./entities/nft.entity";
import axios from "axios";
import { EditCollectionDto } from "./dto/edit.dto";

@Injectable()
export class NftService {
  constructor(
    @InjectModel(Collection.name)
    private readonly collectionModel: Model<Collection>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Nft.name) private readonly nftModel: Model<Nft>,
  ) {}

  async createCollection(createCollectionDto: CollectionDto, user: User) {
    const savedNfts = await Promise.all(
      createCollectionDto.nfts.map(async (nft) => {
        const newNft = new this.nftModel(nft);
        return await newNft.save();
      }),
    );

    const collectionData: Partial<Collection> = {
      name: createCollectionDto.name,
      description: createCollectionDto.description,
      itemsLimit: createCollectionDto.itemsLimit,
      ownerId: user._id,
      nftPrice: createCollectionDto.nftPrice,
      links: createCollectionDto.links,
      nfts: savedNfts.map((item) => item._id.toString()),
      image: createCollectionDto.image,
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

    const plainCollection = newCollection.toObject();

    const response = {
      ...plainCollection,
      nfts: savedNfts.map((nft) => ({
        _id: nft._id.toString(),
        name: nft.name,
        description: nft.description,
        image: nft.image,
      })),
    };

    return response;
  }

  async editCollection(editCollectionDto: EditCollectionDto, user: User) {
    const collection = await this.collectionModel.findOne({
      _id: editCollectionDto._id,
      ownerId: user._id,
    });

    if (!collection) {
      throw new NotFoundException("Collection not found or access denied");
    }

    if (collection.ownerId.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        "You do not have permission to edit this collection",
      );
    }

    if (editCollectionDto.nftPrice !== undefined) {
      collection.nftPrice = editCollectionDto.nftPrice;
    }

    if (editCollectionDto.itemsLimit !== undefined) {
      collection.itemsLimit = editCollectionDto.itemsLimit;
    }

    if (editCollectionDto.links !== undefined) {
      collection.links = editCollectionDto.links;
    }

    if (editCollectionDto.startTime !== undefined) {
      collection.startTime = editCollectionDto.startTime;
    }

    if (editCollectionDto.endTime !== undefined) {
      collection.endTime = editCollectionDto.endTime;
    }

    // Save the updated collection
    const updatedCollection = await collection.save();

    // Return the updated collection data
    return updatedCollection;
  }

  async findCollectionById(id: string) {
    const collection = await this.collectionModel
      .findOne({ _id: id })
      .populate("nfts");
    return collection;
  }

  async findNftById(id: string) {
    const nft = await this.nftModel.findOne({ _id: id }).exec();
    return nft;
  }

  async findUserCollections(userId: number) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) return [];
    return await this.collectionModel
      .find({ ownerId: user._id })
      .populate("nfts")
      .sort({ updatedAt: -1 })
      .exec();
  }

  async publishCollection(id: string, address: string) {
    const collection = await this.findCollectionById(id);
    if (!collection) {
      throw new Error("Collection not found");
    }

    return await this.collectionModel.updateOne(
      { _id: id },
      {
        $set: { address, deployed: true },
      },
    );
  }

  async collectionMetadataJson(id: string) {
    const metadata = await this.collectionModel.findOne({ _id: id });

    const result = {
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
    };

    return result;
  }

  async nftMetadataJson(id: string) {
    const metadata = await this.nftModel.findOne({ _id: id });

    const result = {
      name: metadata?.name,
      description: metadata?.description,
      image: metadata.image,
    };

    return result;
  }

  async checkIsCollectionDeployed(id: string) {
    const collection = await this.findCollectionById(id);

    if (!collection?.address) return;

    const httpHeaders = process.env.TONCENTER_API_KEY
      ? { "X-API-Key": process.env.TONCENTER_API_KEY }
      : undefined;

    const http = axios.create({
      baseURL:
        process.env.TONCENTER_API_ENDPOINT || "https://toncenter.com/api/v3",
      headers: httpHeaders,
    });

    const { data: collectionStatus } = await http.get(
      `/accountStates?address=${collection?.address}`,
    );
    if (collectionStatus?.accounts[0]?.status === "active") {
      await this.collectionModel.updateOne(
        { _id: id },
        {
          $set: { deployed: true },
        },
      );

      return { ok: true, status: "active" };
    } else {
      return { ok: false, status: "uninit" };
    }
  }
}
