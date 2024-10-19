import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  _id: string;

  @Prop({ required: false })
  id: number;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: false })
  username: string;

  @Prop({ required: false })
  languageCode: string;

  @Prop({ required: false })
  photoUrl: string;

  @Prop({required: false, default: true})
  isNewUser: boolean;

  @Prop({required: false, default: false})
  isOnboarded: boolean;

  @Prop({required: false, default: false})
  isAmbasador: boolean;

  @Prop({required: false, default: null})
  walletAddress: string | null;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: false })
  referrer: string;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'User', default: [] }],
    required: false,
  })
  referrals: string[];

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
