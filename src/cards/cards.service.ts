import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card, CardDocument } from './card.schema';
import { CardDto } from './dto/card.dto';

@Injectable()
export class CardsService {

    constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

    async create(cardDto: CardDto): Promise<Card> {
        const createdCard = new this.cardModel(cardDto);
        return createdCard.save();
      }
    
      async findAll(): Promise<Card[]> {
        return this.cardModel.find().exec();
      }
}
    

