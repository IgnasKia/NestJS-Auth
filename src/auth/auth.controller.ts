import { Body, Controller, Get, Header, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
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
    @Get('/admin')
    async getUsers() {
        return await this.authService.getAllUsers();
    }
    
    @UseGuards(AuthGuard())
    @Get('/user/:id')
    async getUserById(@Param('id') id: string) {
        return await this.authService.getUser(id);
    }

}
