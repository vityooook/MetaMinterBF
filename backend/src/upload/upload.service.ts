import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import * as multer from "multer";
import * as sharp from "sharp";
import { createHash } from "crypto";

@Injectable()
export class UploadService {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
      region: "auto",
    });
  }

  public uploadImage() {
    return multer({
      storage: multer.memoryStorage(),
    });
  }

  public async uploadImageToR2(file: Express.Multer.File, userId: string) {
    const webpBuffer = await sharp(file.buffer)
      .webp({ quality: 80 })
      .toBuffer();

    const date = new Date().toISOString().split("T")[0];

    const hash = createHash("sha256")
      .update(`${file.originalname}-${Date.now()}`)
      .digest("hex")
      .substring(0, 8);

    const uploadResult = await this.s3
      .upload({
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
        Key: `user-media/${date}/${userId}/${hash}.webp`,
        Body: webpBuffer,
        ContentType: "image/webp",
        ACL: "public-read",
      })
      .promise();

    return `${process.env.CLOUDFLARE_DOMAIN}${uploadResult.Key}`;
  }
}
