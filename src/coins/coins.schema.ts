import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CoinsDocument = Coins & Document;

@Schema()
export class Coins {

  @Prop()
  id: string;

  @Prop()
  picture: string;

  @Prop()
  issuer: string;

  @Prop()
  public_id: string;

  @Prop()
  userid: [string];

  @Prop()
  year: number;

  @Prop()
  value: number;

  @Prop()
  currency: string;

  @Prop()
  composition: string;

  @Prop()
  weight: number;
  
  @Prop()
  shape: string;

  @Prop()
  comment: string;

}

export const CoinsSchema = SchemaFactory.createForClass(Coins);