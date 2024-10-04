import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { NftItemDto } from "./nft-item.dto";

export class NftCollectionDto {
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
  @IsArray()
  @ValidateNested({ each: true }) // Validate each item in the array
  @Type(() => NftItemDto) // Transform plain objects to ItemDto instances
  items: NftItemDto[]; // Items should be an array of ItemDto

  @IsOptional()
  @IsArray()
  links: string[];
}
