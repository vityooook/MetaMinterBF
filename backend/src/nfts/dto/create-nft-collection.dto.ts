import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateNftCollectionDto {
  @IsNotEmpty()
  @IsString()
  collection_name: string;

  @IsOptional()
  @IsString()
  collection_description?: string;

  @IsOptional()
  @IsString()
  collection_image?: string;

  @IsNotEmpty()
  @IsNumber()
  items_limit: number;

  @IsNotEmpty()
  @IsString()
  item_name: string;

  @IsOptional()
  @IsString()
  item_description?: string;

  @IsNotEmpty()
  @IsString()
  item_image: string;

  @IsNotEmpty()
  @IsNumber()
  item_price: number;

  @IsNotEmpty()
  @IsString()
  hash: string;

  @IsNotEmpty()
  @IsString()
  owner_id: string;

  @IsNotEmpty()
  @IsArray()
  links: string[];
}
