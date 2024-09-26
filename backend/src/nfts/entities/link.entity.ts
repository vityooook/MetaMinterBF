import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LinkDocument = Link & Document;

@Schema()
export class Link {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    validate: {
      validator: (v) => /^https?:\/\//.test(v),
      message: 'Invalid URL format',
    },
  })
  url: string;

  @Prop({ default: 0 })
  order: number;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
