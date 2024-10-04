import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type NftCollectionDocument = NftCollection & Document;

@Schema({ timestamps: true })
export class NftCollection {
  _id: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  owner_id: string;

  @Prop({ required: false })
  hash: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: false })
  imageUrl: string;

  @Prop({ default: true })
  deployed: boolean;

  @Prop()
  address: string;

  @Prop({ default: 0 })
  itemsMinted: number;

  @Prop({ default: 0 })
  itemsLimit: number;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'NftItem', default: [] }],
    required: false,
  })
  items: string[];

  @Prop({
    type: [{ type: String }],
  })
  links: string[];
}

export const NftCollectionSchema = SchemaFactory.createForClass(NftCollection);
