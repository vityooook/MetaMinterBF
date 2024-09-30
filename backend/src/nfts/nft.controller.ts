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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { NftService } from './nft.service';
import { CreateNftCollectionDto } from './dto/create-nft-collection.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { FileService } from 'src/file/file.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editFileName,
  imageFileFilter,
} from 'src/file/utils/file-upload.utils';

@UseGuards(JwtAuthGuard)
@Controller('api/collections')
export class NftController {
  constructor(
    private readonly nftService: NftService,
    private readonly fileService: FileService, // Inject file service
  ) {}

  @Post('/create')
  @UseInterceptors(
    FileInterceptor('nftCollectionImage', {
      storage: diskStorage({
        destination: './assets/images/collections', // Destination folder for collection images
        filename: editFileName, // Logic to define file name
      }),
      fileFilter: imageFileFilter, // Optional filter to validate file types (e.g., images only)
    }),
  )
  @UseInterceptors(
    FileInterceptor('nftItemImage', {
      storage: diskStorage({
        destination: './assets/images/items', // Destination folder for item images
        filename: editFileName, // Logic to define file name
      }),
      fileFilter: imageFileFilter, // Optional filter to validate file types (e.g., images only)
    }),
  )
  async createCollection(
    @UploadedFiles(ParseFilePipe) files: Array<Express.Multer.File>,
    @Body() createCollectionDto: CreateNftCollectionDto,
    @CurrentUser() currentUser,
  ) {
    const uploadedFiles = await this.fileService.handleFiles(files);

    return await this.nftService.createCollection(
      createCollectionDto,
      currentUser,
      uploadedFiles
    );
  }

  @Get(':hash')
  async getNftCollectionByHash(@Param('hash') hash: string) {
    return await this.nftService.findNftCollectionByHash(hash);
  }

  @Get(':hash')
  async getNftItemByHash(@Param('hash') hash: string) {
    return await this.nftService.findNftItemByHash(hash);
  }

  @Get('')
  async findUserCollections(@CurrentUser() currentUser) {
    return await this.nftService.findUserCollections(currentUser);
  }
}
