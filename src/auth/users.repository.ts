import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from "bcrypt";

import { User, UserDocument } from "./user.schema";

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) public userModel: Model<UserDocument>) {}

    async createUser(authCredentialsDto: AuthCredentialsDto){
       
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(authCredentialsDto.password, salt);
        authCredentialsDto.password = hashedPassword;
        const newUser = new this.userModel(authCredentialsDto);

        try {
           await newUser.save();
        } catch (error) {
          // Duplicate error
          if (error.name === 'MongoError' && error.code === 11000) {
            throw new ConflictException('Username already exists');
          } else {
            throw new InternalServerErrorException(error);
          }
        }
  
    }

    async getUsers(){
      const users = this.userModel.find();
      return users;
    }

}