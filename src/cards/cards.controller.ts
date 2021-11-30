import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Card } from './card.schema';
import { CardsService } from './cards.service';
import { CardDto } from './dto/card.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { TradeDto } from './dto/trade.dto';
import { CardTemp } from './cardTemp.schema';

@Controller()
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Post('cards/create')
    async createCard(@Body() cardDto: CardDto) {
        await this.cardsService.create(cardDto);
    }

    @Get('cards')
    async findAll(): Promise<Card[]> {
        return this.cardsService.findAll();
    }

    @Get('cards/:id')
    async findCard(@Param('id') id: string){
        return await this.cardsService.findCardbyId(id);
    }

    @Patch('cards/update/:id')
    async updateCardOwners(@Param('id') id: string, @Body() cardDto: CardDto) {
        await this.cardsService.updateCard(id, cardDto);
    }

    @Get('user/:id/cards')
    async findUserCards(@Param('id') id): Promise<Card[]> {
        return await this.cardsService.getUserCards(id);
    }

    @Get('card/probability')
    async getCardByProbability(){
        return await this.cardsService.getCardByProbability();
    }

    @Patch('user/delete/cards/:id')
    async deleteCardFromUser(@Param('id') id: string, @Body() cardDto: CardDto) {
        await this.cardsService.deleteUserIdFromCard(id, cardDto);
    }

    // TRADING CARDS 

    @Post('cards/trade/create')
    async createTempTrade(@Body() tradeDto: TradeDto) {
        await this.cardsService.createTempTrade(tradeDto);
    }

    @Patch('cards/trade/:id/:status')
    async updateTradeStatus(@Param('id') id: string, @Param('status') status: string) {
        await this.cardsService.tradeStatus(id, status);
    }

    @Get('cards/trades/created/:traderOne')
    async findUserTrades(@Param('traderOne') traderOne: string) {
       return await this.cardsService.getUserTrades(traderOne);
    }


    @Get('cards/trades/requested/:traderTwo')
    async findRequestedTrades(@Param('traderTwo') traderTwo: string) {
       return await this.cardsService.getRequestedTrades(traderTwo);
    }

}
