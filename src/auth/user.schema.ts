import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  id: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);