import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class NftItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional() // Assuming the image is optional; adjust as needed
  image?: any; // Use a more specific type based on your requirements
}
