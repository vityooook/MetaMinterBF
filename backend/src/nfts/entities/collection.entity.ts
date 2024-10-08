import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";

export type CollectionDocument = Collection & Document;

@Schema({ timestamps: true })
export class Collection {
  _id: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "User",
  })
  ownerId: string;

  @Prop({ required: false })
  hash: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: false })
  image: string;

  @Prop({ default: false })
  deployed: boolean;

  @Prop({ default: false })
  deploying: boolean;

  @Prop()
  address: string;

  @Prop({ default: 0 })
  itemsMinted: number;

  @Prop({ default: 0 })
  itemsLimit: number;

  @Prop({
    type: Number,
    required: true,
  })
  nftPrice: number;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: "Nft", default: [] }],
    required: false,
  })
  nfts: string[];

  @Prop({
    type: [{ type: String }],
  })
  links: string[];

  @Prop({
    type: Date,
    required: false,
  })
  startTime: Date;

  @Prop({
    type: Date,
    required: false,
  })
  endTime: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
