import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from "bcrypt";

import { User, UserDocument } from "./user.schema";

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
       
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

      async loginUser(authCredentialsDto: AuthCredentialsDto): Promise<any> {
        const { username, password } = authCredentialsDto;
        const query = this.userModel.findOne({ username });
        
        if (query && (await bcrypt.compare(password, (await query).password ))) {
          console.log('Success');
          // return 'Success';
        } else {
          throw new UnauthorizedException('Please check your login credentials');
        }

      }


}