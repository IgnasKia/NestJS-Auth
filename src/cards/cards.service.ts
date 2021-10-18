import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StringifyOptions } from 'querystring';
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

    async updateCard(id: string, cardDto: CardDto){
      const cardOwner = this.cardModel.findByIdAndUpdate( id, { $push: { userid: cardDto.userid } })

      try {
        (await cardOwner).save();
      } catch (error) {
        // Duplicate error
        console.log(error);
        if (error.name === 'MongoError' && error.code === 11000) {
          throw new ConflictException('Username already exists');
        } 
        else {
          throw new InternalServerErrorException(error);
        }
      }
    }

    async getUserCards(id: string) {
      const userCards = this.cardModel.where( {userid: id} );
      return userCards;
    }
}
