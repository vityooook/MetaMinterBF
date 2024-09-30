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
  async createCollection(
      @Body() createCollectionDto: CreateNftCollectionDto,
      @CurrentUser() currentUser,// Get files if needed
  ) {
    // You will need to handle multiple files. They are accessed via the files array.
    console.log('Received DTO:', createCollectionDto);

    // Handle each file as needed
    // const collectionImage = files[0]; // Assuming this is the collection image
    // const itemImage = files[1]; // Assuming this is the item image

    return await this.nftService.createCollection(
        createCollectionDto,
        currentUser,
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
