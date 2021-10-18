import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CardsModule } from './cards/cards.module';
import moment from 'moment';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, MongooseModule.forRoot(process.env.DATABASE), CardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
