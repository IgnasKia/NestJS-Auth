import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  const words = ["house", "hello", "world"];
  getHello(): string {
    return JSON.parse(this.words);
  }
}
