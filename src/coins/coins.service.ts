
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import e from 'express';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { resourceLimits } from 'worker_threads';
import { Coins, CoinsDocument } from './coins.schema';
import { CoinsDto } from './dto/coins.dto';

@Injectable()
export class CoinsService {

    constructor(@InjectModel(Coins.name) private coinsModel: Model<CoinsDocument>, private cloudinary: CloudinaryService) {}

    async findUserCoins(id: string) {
      const coins = this.coinsModel.find({ userid: id}).exec();
      return coins;
    }

    async uploadCoin(file: Express.Multer.File, coinsDto: CoinsDto) {

      const result = await this.cloudinary.uploadImage(file).catch(() => {
          throw new BadRequestException('Invalid file type.');
        });
      
      const createdCard = new this.coinsModel(coinsDto);
      createdCard.picture = result.secure_url;
      createdCard.public_id = result.public_id;
      console.log(createdCard.userid);
      return await createdCard.save();
      
  }

    async updateCoin(file: Express.Multer.File, coinsDto: CoinsDto, publicId: string, coinId: string) {

      if(file){
          const result = await this.cloudinary.updateImage(publicId, file).catch(() => {
            throw new BadRequestException('Invalid file type.');
        });
        coinsDto.picture = result.secure_url;
        coinsDto.public_id = result.public_id;
      }

      const updateCard = this.coinsModel.findByIdAndUpdate(coinId, coinsDto);

      (await updateCard).save();
      
    }

    async deleteUserIdFromCoin(id: string, coinsDto: CoinsDto){
      return await this.coinsModel.updateOne({ _id: id }, {
        $pull: {
            userid: coinsDto.userid
        },
      });
    }

    async addUserIdInCoin(id: string, coinsDto: CoinsDto) {
    
    const result = this.coinsModel.exists({_id:id, userid: coinsDto.userid});
    if(await result){
      return "Error: You already added this coin to your collecion"
      }else {
        return await this.coinsModel.updateOne({ _id: id }, {
          $push: {
              userid: coinsDto.userid
          },
        });
      }
  
    }

      async deleteCoin(publicId: string, coinId: string ) {
        
        await this.coinsModel.findByIdAndDelete(coinId);

        const result = await this.cloudinary.deleteImage(publicId).catch(() => {
            throw new BadRequestException('Invalid file type.');
          });
        return result;
      }

      async getAllCoins(): Promise<Coins[]>  {
        return this.coinsModel.find().exec();
      }
      
      async findCoinbyId(id: string) {
        const coin = this.coinsModel.findById(id).exec();
        return coin;
      }

      

        
}
