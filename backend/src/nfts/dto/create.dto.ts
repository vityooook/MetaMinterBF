import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";

export class NftDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price: number;
}

export class CollectionDto {
  @IsOptional()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  itemsLimit: number;

  @IsNotEmpty()
  @IsNumber()
  nftPrice: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true }) // Validate each item in the array
  @Type(() => NftDto) // Transform plain objects to ItemDto instances
  nfts: NftDto[]; // Items should be an array of ItemDto

  @IsOptional()
  @IsArray()
  links: string[];

  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @IsOptional()
  @IsDateString()
  endTime?: Date;
}
