import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NftCollection } from "./entities/nft-collection.entity";
import { User } from "../users/entities/user.entity";
import { NftCollectionDto } from "./dto/nft-collection";
import { NftItem } from "./entities/nft-item.entity";
import { beginCell, storeStateInit, Address, Cell, toNano } from "@ton/core";
import { buildNftCollectionContentCell } from "./nft.helper";
import { nanoid } from "nanoid";

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
    const hash = nanoid(16);

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

    const nftCollection: Partial<NftCollection> = {
      name: createCollectionDto.name,
      description: createCollectionDto.description,
      hash,
      itemsLimit: createCollectionDto.itemsLimit,
      owner_id: user._id,
      links: createCollectionDto.links,
      items: savedNftItems.map((item) => item._id.toString()),
      imageUrl: collectionImagePath,
      dateFrom: createCollectionDto.dateFrom
        ? new Date(createCollectionDto.dateFrom)
        : undefined,
      dateTo: createCollectionDto.dateTo
        ? new Date(createCollectionDto.dateTo)
        : undefined,
    };

    const newCollection = new this.collectionModel(nftCollection);

    await newCollection.save();

    const response = {
      ...nftCollection,
      hash,
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

  async findNftCollectionByHash(hash: string) {
    const collection = await this.collectionModel.findOne({ hash });
    if (!collection || !collection.deployed) {
      throw new NotFoundException("Collection not found");
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
      .find({ owner_id: user._id })
      .populate("items")
      .sort({ updatedAt: -1 })
      .exec();
  }

  private async createNftBlockchain(
    hash: string,
    user_address: string,
    item_price: bigint,
    items_limit: number,
  ) {
    const admin_address = "";

    const NftCollectionCodeBoc =
      "b5ee9c7241021e010005a7000114ff00f4a413f4bcf2c80b0102016202170202cd0310020120040f04f743322c700925f03e0d0d3030171b0925f03e0fa403002d31fd33f31ed44d0fa4001f861fa4001f862d401d0d401f863d401f864d401f865d1d20701f866fa0001f867d31f01f868d31f01f869d31f01f86ad31f01f86bfa0030f86c21c001e30232f8415230c705f8425240c705b1f2e04520c002e30220c003e3028050c0d0e01fc31d31f30f8475210a85220b98e255b70c8cb1f8d05539bdd08195b9bdd59da08199d5b991cc83c27e4ac20cf1670018040f007e0f8468e345b70c8cb1f8d0914d85b19481a5cc81d195b5c1bdc985c9a5b1e481d5b985d985a5b18589b19483c27e6aae0cf1670018040f007e1f823f84abef823f84bbbb0f84af84bbab10603fcf823f84abef84bc000b0b1f84ac000f823f84bbbb0b18e355b70c8cb1f8d09539195081a5cc81b9bdd08185d985a5b18589b1948185d081d1a1a5cc81d1a5b594838a3ece0cf1670018040f007e1f8485210a0f849b9f849c000b1e30331209cf848f84523f006f848a4f868e4f842f84c58a86d71f00770c8cb1f89cf16070a0b017630f849f848a1c200e3023070c8cb1f8d08505b1b081391951cc8185c9948185b1c9958591e481cdbdb19081bdd5d0838a6e520cf1670018040f0070801fcf849f848a170c8cb1f8d04965bdd4818d85b881bdb9b1e481b5a5b9d0820cf162170019c7aa90ca6304313a45110c000e63092cb07e48bb204e465420e29aa1efb88f8cf16f8475220a813a18209312d00a154431370f007209cf848f84523f006f848a4f868e431f842f84c58a86d71f007820afaf08070fb02f841706d09000c8306f007f00300444e46542070757263686173652077696c6c2062652061207375636365737320e29c85003682080f42400171f007820afaf08070fb02f841706d8306f007f003005630f84212c705f2e2c3d31ffa4030f8485220bbf2e2c4f84812baf848f8455502f00697f848a4f868f003de00d23031fa0001f867d31f01f869d31f01f86ad31f01f86bd20701f866fa4030f861f8418d0860000000000000000000000000000000000000000000000000000000000000000004c70594f841f862def849f848bcf849c000b1f2e2c5f84782100bebc200b9f2d2c6f003008a20c0048e1e5f03708018c8cb05f842cf1621fa02cb6a820898968070fb02c98306fb00e0c0058e17f84212c705f2e2c3fa0001f86cd401f863d430f864f003e05b840ff2f000695f84bf84af849f848f846f845f844f843c8ccccccc9c8f841cf16f842cf16ccca07f847fa02cb1fcb1fcb1fcb1ff84cfa02c9ed54802012011140201201213002d007232cffe0a33c5b25c083232c044fd003d0032c03260001b3e401d3232c084b281f2fff2742002012015160057167c011c087c017e1132140133c584f3325de0063232c1540133c5a0827270e03e8084f2daf333325c7ec02000431c20063232c1540173c59400fe8084f2da889bace51633c5c0644cb88072407ec020020120181d020120191c0201201a1b00a9b56ba63da89a1f48003f0c3f48003f0c5a803a1a803f0c7a803f0c9a803f0cba3a40e03f0cdf40003f0cfa63e03f0d1a63e03f0d3a63e03f0d5a63e03f0d7f40061f0d9f087a1a863a861a0e391960e039e2d9993000b1b5cb3da89a1f48003f0c3f48003f0c5a803a1a803f0c7a803f0c9a803f0cba3a40e03f0cdf40003f0cfa63e03f0d1a63e03f0d3a63e03f0d5a63e03f0d7f40061f0d9f083f085f08df08ff091f093f095f097f099f087f08900095ba7a3ed44d0fa4001f861fa4001f862d401d0d401f863d401f864d401f865d1d20701f866fa0001f867d31f01f868d31f01f869d31f01f86ad31f01f86bfa0030f86cf845f0047001f00580099bc82df6a2687d2000fc30fd2000fc316a00e86a00fc31ea00fc326a00fc32e8e90380fc337d0000fc33e98f80fc34698f80fc34e98f80fc35698f80fc35fd00187c367c21e87c2400ea187c20cdb09c09d";
    const NftCollectionCodeCell = Cell.fromBoc(
      Buffer.from(NftCollectionCodeBoc, "hex"),
    )[0];

    const NftItemCodeBoc =
      "b5ee9c7241020d010001d6000114ff00f4a413f4bcf2c80b01020162020c0202ce0309020120040802e30c8871c02497c0f83434c0c05c6c2497c0f83e903e900c7e800c5c75c87e800c7e800c1cea6d003c00812ce3850c1b088d148cb1c17cb865407e90350c0408fc00f801b4c7f4cfe08417f30f45148c2ea3a24c840dd78c9004f6cf380c0d0d0d4d60840bf2c9a884aeb8c097c12103fcbc20050701f65135c705f2e191fa4021f001fa40d20031fa00820afaf0801ba121945315a0a1de22d70b01c300209206a19136e220c2fff2e192218e3e821005138d91c85009cf16500bcf16712449145446a0708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb00104794102a375be2060082028e3526f0018210d53276db103744006d71708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb0093303234e25502f00300727082108b77173505c8cbff5004cf1610248040708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb0000113e910c1c2ebcb853600201200a0b003b3b513434cffe900835d27080269fc07e90350c04090408f80c1c165b5b60001d00f232cfd633c58073c5b3327b55200009a11f9fe005042c0d2f";
    const NftIemCodeCell = Cell.fromBoc(Buffer.from(NftItemCodeBoc, "hex"))[0];

    const collectionContent =
      process.env.API_DOMAIN + "metadata/" + hash + "/collection.json";
    const itemContent = process.env.API_DOMAIN + "metadata/" + hash + "/";

    const Data = beginCell()
      .storeAddress(Address.parse(user_address))
      .storeAddress(Address.parse(admin_address))
      .storeRef(
        beginCell()
          .storeRef(
            buildNftCollectionContentCell(collectionContent, itemContent),
          )
          .storeRef(beginCell().storeBuffer(Buffer.from("nft.json")).endCell())
          .storeRef(NftIemCodeCell)
          .endCell(),
      )
      .storeInt(-1, 8)
      .storeCoins(item_price)
      .storeUint(0, 32)
      .storeUint(items_limit, 32)
      .storeUint(0, 32)
      .storeUint(0, 32)
      .storeCoins(toNano("0.1"))
      .endCell();

    const stateInit = {
      code: NftCollectionCodeCell,
      data: Data,
    };

    const stateInitCell = beginCell()
      .store(storeStateInit(stateInit))
      .endCell();

    const nftCollectionAddress = new Address(0, stateInitCell.hash());

    return nftCollectionAddress;
  }
}
