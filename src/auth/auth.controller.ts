import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    async craeteUser(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        await this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<any> {
        await this.authService.signIn(authCredentialsDto);
    }
}
