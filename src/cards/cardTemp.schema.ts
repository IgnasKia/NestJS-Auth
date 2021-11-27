import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CardTempDocument = CardTemp & Document;

@Schema()
export class CardTemp {

  @Prop()
  id: string;

  @Prop()
  traderOne: string;

  @Prop()
  traderTwo: string;

  @Prop()
  traderOneCardId: string;

  @Prop()
  traderTwoCardId: string;

  @Prop({
      default: "active"
  })
  status: string;

}

export const CardTempSchema = SchemaFactory.createForClass(CardTemp);