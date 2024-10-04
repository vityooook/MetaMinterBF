import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  UploadedFile,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { NftService } from "./nft.service";
import { NftCollectionDto } from "./dto/nft-collection";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { FileService } from "src/file/file.service";
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from "@nestjs/platform-express";
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
          destination: (req, file, cb) => {
            // Use the field name to determine the destination
            const dest =
              file.fieldname === "image"
                ? "./assets/images/collections"
                : "./assets/images/items";
            cb(null, dest); // Callback with destination
          },
          filename: editFileName, // Use custom filename function
        }),
      },
    ),
  )
  async createCollection(
    @Body() createCollectionDto: NftCollectionDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() currentUser,
  ) {
    console.log("Received DTO:", createCollectionDto);

    console.log(files);

    return await this.nftService.createCollection(
      createCollectionDto,
      currentUser,
    );
  }

  @Get(":hash")
  async getNftCollectionByHash(@Param("hash") hash: string) {
    return await this.nftService.findNftCollectionByHash(hash);
  }

  @Get(":hash")
  async getNftItemByHash(@Param("hash") hash: string) {
    return await this.nftService.findNftItemByHash(hash);
  }

  @Get("")
  async findUserCollections(@CurrentUser() currentUser) {
    return await this.nftService.findUserCollections(currentUser);
  }
}
