import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { UsersRepository } from './users.repository';
import { User } from './user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { JwtPayload } from './dto/jwt-payload.interface';


@Injectable()
export class AuthService {
    User: any;
    constructor(private readonly usersRepository: UsersRepository, private jwtService: JwtService,) {}

    async signUp(authCredentialsDto: AuthCredentialsDto){
      await this.usersRepository.createUser(authCredentialsDto);
    }
    
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
      const { username, password } = authCredentialsDto;

      const query = await this.usersRepository.userModel.findOne({ username });
      if (query && (await bcrypt.compare(password, (await query).password ))) {
        const payload: JwtPayload = { username };
        const accessToken: string = await this.jwtService.sign(payload);
        return {accessToken};
        console.log('Success');
        // res.status(200).json({success: true});
      } else {
        // res.status(401).json({success: false});
        throw new UnauthorizedException('Please check your login credentials');
      }
    }

    async getAllUsers(){
      return this.usersRepository.getUsers();
    }

}
