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

    async deleteUserIdFromCard(id: string, cardDto: CardDto){
      const cardOwner = await this.cardModel.findByIdAndUpdate(
        { _id: id },
        [
          {
            $set: {
              userid: {
                $let: {
                  vars: { ix: { $indexOfArray: ["$userid", cardDto.userid] } },
                  in: {
                    $concatArrays: [
                      { $slice: ["$userid", 0, "$$ix"] },
                      [],
                      { $slice: ["$userid", { $add: [1, "$$ix"] }, { $size: "$userid" }] }
                    ]
                  }
                }
              }
            }
          }
        ])
      
      try {
        cardOwner.save();
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


    async updateCard(id: string, cardDto: CardDto){
      const cardOwner = this.cardModel.findByIdAndUpdate( id, { $pull: { userid: cardDto.userid } });
      
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

    async getCardByProbability(){
      let randomNumber = Math.floor(Math.random() * (100 - 1) + 1);
      if(randomNumber>=1 && randomNumber<=65) {
        // In this case to get common card chance is - 65%
        return this.getByRarity("common");
      } 
      else if(randomNumber>=66 && randomNumber<=85){
        // In this case to get uncommon card chance is - 20%
        return this.getByRarity("uncommon");
      }
      else if(randomNumber>=86 && randomNumber<=95){
        // In this case to get common card chance is - 10%
        return this.getByRarity("rare");
      }
      else {
        // In this case to get common card chance is - 5%
        return this.getByRarity("legendary");}
    }

    // Count how many cards are with specific rarity
    // Get random number with counted cards number
    // Find cards with specific rarity and take random only one card
    async getByRarity(rarityName: string): Promise<Card> {
      const howManyrecords = this.cardModel.count( {rarity: rarityName} );
      let random = Math.floor(Math.random() * await howManyrecords);
      const card = this.cardModel.findOne( {rarity: rarityName} ).skip(random).exec();
      return card;
    }
    
}
