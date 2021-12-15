import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Coins, CoinsSchema } from './coins.schema';
import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Coins.name, schema: CoinsSchema }]),
      CloudinaryModule,
    ],
    providers: [CoinsService],
    controllers: [CoinsController],
    exports: [ CoinsService ],
  })
export class CoinsModule {}
