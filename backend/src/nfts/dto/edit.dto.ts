import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDateString,
} from "class-validator";

export class EditCollectionDto {
  @IsNotEmpty()
  @IsString()
  _id: string; // ID of the collection to be edited

  @IsOptional()
  @IsNumber()
  itemsLimit: number;

  @IsNotEmpty()
  @IsNumber()
  nftPrice: number;

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
