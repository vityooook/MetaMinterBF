import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NftDocument = Nft & Document;

@Schema({ timestamps: true })
export class Nft {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, maxlength: 500 })
  description?: string;

  @Prop({ required: false })
  image: string;

  createdAt: Date;
  updatedAt: Date;
}

export const NftSchema = SchemaFactory.createForClass(Nft);
