import { Module } from '@nestjs/common';
import { Card, CardSchema } from './card.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }])
    ],
    providers: [CardsService],
    controllers: [CardsController],
    exports: [ CardsService ],
  })
export class CardsModule {}
