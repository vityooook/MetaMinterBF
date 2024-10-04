import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NftItemDocument = NftItem & Document;

@Schema({ timestamps: true })
export class NftItem {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, maxlength: 500 })
  description?: string;

  @Prop({ required: false })
  imageUrl: string;

  @Prop({
    type: Number,
  })
  price?: number;

  createdAt: Date;
  updatedAt: Date;
}

export const NftItemSchema = SchemaFactory.createForClass(NftItem);
