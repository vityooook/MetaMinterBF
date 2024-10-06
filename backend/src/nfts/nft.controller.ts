import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { NftService } from "./nft.service";
import { NftCollectionDto } from "./dto/nft-collection";
import { PublishDto } from "./dto/publish.dto";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { FileService } from "src/file/file.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import {
  editFileName,
  imageFileFilter,
} from "src/file/utils/file-upload.utils";

@UseGuards(JwtAuthGuard)
@Controller("api/collections")
export class NftController {
  constructor(
    private readonly nftService: NftService,
    private readonly fileService: FileService,
  ) {}

  @Post("/create")
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "image", maxCount: 1 },
        { name: "items.image", maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (_, file, cb) => {
            const dest =
              file.fieldname === "image"
                ? "./assets/images/collections"
                : "./assets/images/items";
            cb(null, dest);
          },
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      },
    ),
  )
  async createCollection(
    @Body() createCollectionDto: NftCollectionDto,
    @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
    @CurrentUser() currentUser,
  ) {
    return await this.nftService.createCollection(
      createCollectionDto,
      files,
      currentUser,
    );
  }

  @Get(":id")
  async getNftCollectionById(@Param("id") id: string) {
    return await this.nftService.findNftCollectionById(id);
  }

  @Get("")
  async findUserCollections(@CurrentUser() currentUser) {
    return await this.nftService.findUserCollections(currentUser);
  }

  @Post("publish")
  async publishCollection() {
    return await this.nftService.publishCollection();
  }
}
