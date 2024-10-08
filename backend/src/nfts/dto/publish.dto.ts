import { IsNotEmpty, IsString } from "class-validator";

export class PublishDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
