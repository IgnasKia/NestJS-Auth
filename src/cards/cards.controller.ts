import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Card } from './card.schema';
import { CardsService } from './cards.service';
import { CardDto } from './dto/card.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Post('/create')
    async create(@Body() cardDto: CardDto) {
        await this.cardsService.create(cardDto);
    }

    @Get()
    async findAll(): Promise<Card[]> {
        return this.cardsService.findAll();
    }
}
