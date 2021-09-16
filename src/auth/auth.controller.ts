import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from './admin.guard';

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
    
    @UseGuards(AuthGuard(), AdminGuard)
    @Get('admin')
    getProfile() {
        return "Logged in as admin";
    }
    
}
