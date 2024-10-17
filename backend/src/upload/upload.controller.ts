import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Body,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { JwtAuthGuard } from "src/auth/auth.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";

@UseGuards(JwtAuthGuard)
@Controller("api/upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("image")
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    data: {
      resolution?: string;
    },
    @CurrentUser() user,
  ) {
    if (!file) {
      throw new Error("File is required");
    }
    const url = await this.uploadService.uploadImageToR2(
      file,
      user._id,
      data?.resolution,
    );
    return { url };
  }
}
