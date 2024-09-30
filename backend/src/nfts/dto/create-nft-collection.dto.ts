import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateNftCollectionDto {
  @IsNotEmpty()
  @IsString()
  collection_name: string;

  @IsOptional()
  @IsString()
  collection_description?: string;

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
  @IsNumber()
  item_price: number;

  @IsNotEmpty()
  @IsArray()
  links: string[];
}
