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
    constructor(private readonly usersRepository: UsersRepository, private jwtService: JwtService) {}

    async signUp(authCredentialsDto: AuthCredentialsDto){
      await this.usersRepository.createUser(authCredentialsDto);
    }
    
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
      const { username, password } = authCredentialsDto;

      const query = await this.usersRepository.userModel.findOne({ username });
      if (query && (await bcrypt.compare(password, (await query).password ))) {
        const payload: JwtPayload = { username, _id: query._id, admin: query.admin};
        const accessToken: string = await this.jwtService.sign(payload);
        return {accessToken};
      } else {
        throw new UnauthorizedException('Please check your login credentials');
      }
    }

    async getAllUsers(){
      return this.usersRepository.getUsers();
    }

    async getUser(id) {
      return this.usersRepository.getUser(id);
    }
    
    async updateUser(id, authCredentialsDto: AuthCredentialsDto) {
      return this.usersRepository.updateUser(id, authCredentialsDto);
    }

    async removeUser(id) {
      return this.usersRepository.removeUser(id);
    }
}
