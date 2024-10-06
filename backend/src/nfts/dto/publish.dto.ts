import { IsNotEmpty, IsString } from "class-validator";

export class PublishDto {
  @IsNotEmpty()
  @IsString()
  collectionId: string;

  @IsNotEmpty()
  @IsString()
  collectionAddress: string;
}
