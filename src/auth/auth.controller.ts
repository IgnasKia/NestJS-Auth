import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    async craeteUser(@Body() authCredentialsDto: AuthCredentialsDto){
        await this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
         return await this.authService.signIn(authCredentialsDto);
    }
    @UseGuards(AuthGuard())
    @Get('profile')
    getProfile() {
        return "Logged in";
    }
    
}
