import { Injectable, BadRequestException } from "@nestjs/common";
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import * as multer from "multer";
import * as sharp from "sharp";
import { createHash } from "crypto";

@Injectable()
export class UploadService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
      },
      region: "auto",
      forcePathStyle: true,
    });
  }

  public uploadImage() {
    return multer({
      storage: multer.memoryStorage(),
    });
  }

  public async uploadImageToR2(
    file: Express.Multer.File,
    userId: string,
    resolution?: string,
  ) {
    // Проверяем формат файла
    const supportedFormats = ["jpeg", "jpg", "png", "svg", "webp"];
    const fileExtension = file.originalname.split(".").pop().toLowerCase();

    if (!supportedFormats.includes(fileExtension)) {
      throw new BadRequestException(
        `Unsupported file format. Only ${supportedFormats.join(", ")} are allowed.`,
      );
    }

    // Обрабатываем изображение, добавляем автоориентацию и рекомендуем размер
    const recommendedSize = resolution; // Рекомендуемый размер 512x512 пикселей
    const imageBuffer = await sharp(file.buffer)
      .rotate()
      .resize({
        width: Number(recommendedSize),
        height: Number(recommendedSize),
        fit: sharp.fit.cover, // Принудительное приведение к квадрату 512x512
      })
      .toBuffer(); // Автоориентация изображения

    const date = new Date().toISOString().split("T")[0];

    const hash = createHash("sha256")
      .update(`${file.originalname}-${Date.now()}`)
      .digest("hex")
      .substring(0, 8);

    const params = {
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: `user-media/${date}/${userId}/${hash}.${fileExtension}`,
      Body: imageBuffer,
      ContentType: `image/${fileExtension}`,
      ACL: ObjectCannedACL.public_read, // Use the enum for 'public-read'
    };

    const command = new PutObjectCommand(params);

    try {
      const uploadResult = await this.s3Client.send(command);
      return `${process.env.CLOUDFLARE_DOMAIN}/${process.env.CLOUDFLARE_BUCKET_NAME}/${params.Key}`;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  }
}
