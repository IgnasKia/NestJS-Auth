import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Coins } from './coins.schema';
import { CoinsService } from './coins.service';
import { CoinsDto } from './dto/coins.dto';


@Controller()
export class CoinsController {

    constructor(private readonly coinsService: CoinsService) {}

    @Post('coins/upload')
    @UseInterceptors(FileInterceptor('file'))
    async createCoin(@UploadedFile() file: Express.Multer.File, @Body() coinsDto: CoinsDto) {
        return await this.coinsService.uploadCoin(file, coinsDto);
    }

    @Delete('coins/delete/:publicId/:coinId')
    async deleteImage( @Param('publicId') publicId: string, @Param('coinId') coinId: string) {
        return await this.coinsService.deleteCoin(publicId, coinId);
    }

    @Put('coins/update/:publicId/:coinId')
    @UseInterceptors(FileInterceptor('file'))
    async updateImage(@UploadedFile() file: Express.Multer.File, @Param('publicId') publicId: string, @Param('coinId') coinId: string, @Body() coinsDto: CoinsDto) {
        return await this.coinsService.updateCoin(file, coinsDto, publicId, coinId);
    }

    @Patch('coins/user/delete/:coinId')
    async deleteUserIdFromCoin(@Param('userid') coinId: string, @Body() coinsDto: CoinsDto) {
        return await this.coinsService.deleteUserIdFromCoin(coinId, coinsDto);
    }

    @Patch('coins/user/add/:coinId')
    async addUserIdToCoin(@Param('coinId') coinId: string, @Body() coinsDto: CoinsDto) {
        return await this.coinsService.addUserIdInCoin(coinId, coinsDto);
    }

    @Get('coins')
    async findAll(): Promise<Coins[]> {
        return await this.coinsService.getAllCoins();
    }

    @Get('coins/:id')
    async findCoin(@Param('id') id: string){
        return await this.coinsService.findCoinbyId(id);
    }

    @Get('coins/user/:id')
    async findUserCoins(@Param('id') id: string){
        return await this.coinsService.findUserCoins(id);
    }
}
