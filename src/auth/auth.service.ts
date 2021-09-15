import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { UsersRepository } from './users.repository';
import { User } from './user.schema';

@Injectable()
export class AuthService {
    User: any;
    constructor(private readonly usersRepository: UsersRepository) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
      await this.usersRepository.createUser(authCredentialsDto);
    }
    
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<any> {
      await this.usersRepository.loginUser(authCredentialsDto);
    }
}
