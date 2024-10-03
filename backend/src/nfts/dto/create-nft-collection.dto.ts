import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateNftCollectionDto {
  @IsNotEmpty()
  @IsString()
  collectionName: string;

  @IsOptional()
  @IsString()
  collectionDescription?: string;

  @IsNotEmpty()
  @IsNumber()
  itemsLimit: number;

  @IsNotEmpty()
  @IsString()
  itemName: string;

  @IsOptional()
  @IsString()
  itemDescription?: string;

  @IsNotEmpty()
  @IsNumber()
  itemPrice: number;

  @IsNotEmpty()
  @IsArray()
  links: string[];
}
