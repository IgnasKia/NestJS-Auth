import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StringifyOptions } from 'querystring';
import { Card, CardDocument } from './card.schema';
import { CardTemp, CardTempDocument } from './cardTemp.schema';
import { CardDto } from './dto/card.dto';
import { TradeDto } from './dto/trade.dto';

@Injectable()
export class CardsService {

    constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>, @InjectModel(CardTemp.name) private cardTempModel: Model<CardTempDocument>) {}

    async create(cardDto: CardDto): Promise<Card> {
      const createdCard = new this.cardModel(cardDto);
      return createdCard.save();
    }
    
    async createTempTrade(tradeDto: TradeDto): Promise<CardTemp> {
      const createdTempTrade = new this.cardTempModel(tradeDto);
      await this.deleteUserIdFromCardAfterTrade(tradeDto);
      return createdTempTrade.save();
    }

    async tradeStatus(id: string, status: string) {
      if (status == "accepted"){
        const trade = await this.cardTempModel.findById(id);
        this.tradeCards(trade, status);
      } else if (status == "declined") {
        const trade = await this.cardTempModel.findById(id);
        this.tradeCards(trade, status);
      }
    }

    async findTradeId(traderOne: string, traderTwo: string) {
      const trade = await this.cardTempModel.findOne({ traderOne: traderOne, traderTwo: traderTwo });
      return trade;
    }

    async getRequestedTrades(traderTwo: string) {
      const requestedTrades = await this.cardTempModel.find({ traderTwo: traderTwo }).exec();
      return requestedTrades;
    }

    async getUserTrades(traderOne: string) {
      const trades = await this.cardTempModel.find({ traderOne: traderOne }).exec();
      return trades;
    }

    async findCardbyId(id: string) {
      const card = this.cardModel.findById(id).exec();
      return card;
    }

    async tradeCards(tradeDto: TradeDto, status: string) {

      await this.newOwnerAfterTrade(tradeDto, status);
      await this.cardTempModel.findByIdAndDelete(tradeDto._id);

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

    async deleteUserIdFromCardAfterTrade(tradeDto: TradeDto){
      const cardOwner1 = await this.cardModel.findByIdAndUpdate(
        { _id: tradeDto.traderOneCardId },
        [
          {
            $set: {
              userid: {
                $let: {
                  vars: { ix: { $indexOfArray: ["$userid", tradeDto.traderOne] } },
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

        const cardOwner2 = await this.cardModel.findByIdAndUpdate(
          { _id: tradeDto.traderTwoCardId },
          [
            {
              $set: {
                userid: {
                  $let: {
                    vars: { ix: { $indexOfArray: ["$userid", tradeDto.traderTwo] } },
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
        cardOwner1.save();
        cardOwner2.save();
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
      const cardOwner = this.cardModel.findByIdAndUpdate( id, { $push: { userid: cardDto.userid } });
      
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

    async newOwnerAfterTrade(tradeDto: TradeDto, status: string){
      if ( status == "accepted") {
        const cardOwner1 = this.cardModel.findByIdAndUpdate( tradeDto.traderOneCardId, { $push: { userid: tradeDto.traderTwo } });
        const cardOwner2 = this.cardModel.findByIdAndUpdate( tradeDto.traderTwoCardId, { $push: { userid: tradeDto.traderOne } });
        try {
          (await cardOwner1).save();
          (await cardOwner2).save();
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
      } else {
        const cardOwner1 = this.cardModel.findByIdAndUpdate( tradeDto.traderOneCardId, { $push: { userid: tradeDto.traderOne } });
        const cardOwner2 = this.cardModel.findByIdAndUpdate( tradeDto.traderTwoCardId, { $push: { userid: tradeDto.traderTwo } });
        try {
          (await cardOwner1).save();
          (await cardOwner2).save();
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

    async getUserCards(id: string) {
      const howManyrecords = this.cardModel.aggregate([
        { 
            $match: { 
                userid: id 
                }
            
        },
        {
            "$project": {
                "name":"$name",
                "userid":"$userid",
                "picture": "$picture",
                "price": "$price",
                "rarity":"$rarity",
                "howMany": {
                    "$size": {
                        "$filter": {
                            "input": "$userid",
                            "as": "userid",
                            "cond": {
                                "$eq": ["$$userid", id]
                            }
                        }
                    }
                }
            }
        }
    ]);

    return howManyrecords;
    }
    
}
