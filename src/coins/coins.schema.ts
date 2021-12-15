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
  country: string;

  @Prop()
  public_id: string;

  @Prop()
  userid: [string];
}

export const CoinsSchema = SchemaFactory.createForClass(Coins);