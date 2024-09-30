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
  title: string;

  @Prop()
  description: string;

  @Prop({ required: false })
  image: string;

  @Prop({ default: true })
  deployed: boolean;

  @Prop()
  address: string;

  @Prop({ default: 0 })
  items_minted: number;

  @Prop({ default: 0 })
  items_limit: number;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'NftItem', default: [] }],
    required: false,
  })
  items: string[];

  @Prop({
    type: [{ type: String }],
  })
  links: string[];

  @Prop()
  collection_address: string;
}

export const NftCollectionSchema = SchemaFactory.createForClass(NftCollection);
