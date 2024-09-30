import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NftItemDocument = NftItem & Document;

@Schema({ timestamps: true })
export class NftItem {
  @Prop({ required: true })
  title: string;

  @Prop({ type: String, maxlength: 500 })
  description?: string;

  @Prop({ required: false })
  image: string;

  @Prop({
    type: Number,
  })
  price?: number;

}

export const NftItemSchema = SchemaFactory.createForClass(NftItem);
