import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from "./user.schema";
import { find } from "rxjs";
import { ExtractJwt } from "passport-jwt";

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) public userModel: Model<UserDocument>, private jwtService: JwtService) {}

    async createUser(authCredentialsDto: AuthCredentialsDto){
       
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(authCredentialsDto.password, salt);
        authCredentialsDto.password = hashedPassword;
        const newUser = new this.userModel(authCredentialsDto);

        try {
           await newUser.save();
        } catch (error) {
          // Duplicate error
          console.log(error);
          if (error.name === 'MongoError' && error.code === 11000) {
            throw new ConflictException('Username already exists');
          } 
          else {
            throw new InternalServerErrorException(error);
          }
        }
    }
    

    async getUsers(){
      const users = this.userModel.find();
      return users;
    }

    async getUser(id){
      const user = this.userModel.findById(id);
      return user;
    }

    async removeUser(id){
      return this.userModel.findByIdAndDelete(id);
    }

    async updateUser(id, authCredentialsDto: AuthCredentialsDto){
      const updatedUser = this.userModel.findByIdAndUpdate(id, authCredentialsDto);

      try {
       (await updatedUser).save();
     } catch (error) {
       // Duplicate error
       console.log(error);
       if (error.name === 'MongoError' && error.code === 11000) {
         throw new ConflictException('Username already exists');
       } 
       else {
         throw new InternalServerErrorException(error);
       }
     }
    }

}