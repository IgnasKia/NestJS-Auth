import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CardDocument = Card & Document;

@Schema()
export class Card {

  @Prop()
  id: string;

  @Prop({
    default: "616dc8234559a62d0cfe6692"
  })
  userid: [];

  @Prop({ 
    type: String,
    required: true,
    minlength: 4,
    maxlength: 20,
    unique: true
  })
  name: string;

  @Prop({
    default: " "
  })
  picture: string;

  @Prop({ 
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 5
  })
  price: number;

  @Prop({ 
    type: String,
    required: true,
  })
  rarity: string;

}

export const CardSchema = SchemaFactory.createForClass(Card);