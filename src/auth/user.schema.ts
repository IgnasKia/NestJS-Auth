import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop()
  id: string;

  @Prop({
    default: 0
  })
    cardQuantity: number;

  @Prop({ 
    type: String,
    required: true,
    minlength: 4,
    maxlength: 30
  })
    fullName: string;

  @Prop({ 
    type: String,
    required: true,
    minlength: 4,
    maxlength: 30,
    unique: true
  })
    email: string;

  @Prop({
    default: 0
  })
    balance: number;

  @Prop({
    default: false
  })
    admin: boolean;

  @Prop({ 
    type: String,
    required: true,
    minlength: 4,
    maxlength: 20,
    unique: true
  })
    username: string;

  @Prop({ 
    type: String,
    required: true,
    minlength: 8,
    maxlength: 60,
    validate: {
      validator: function(v) {
          return /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(v);
      },
      message: "Please enter a valid password"
    },
  })
  password: string;

  @Prop({

    default: moment().subtract(1, 'days').format()
  // default: new Date(new Date().setDate(new Date().getDate() - 1))
  })
    lastReward: string;

}

export const UserSchema = SchemaFactory.createForClass(User);