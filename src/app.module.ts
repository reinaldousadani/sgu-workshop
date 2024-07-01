import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

let envFilePath: string = '.env';

switch (`${process.env.NODE_ENV}`) {
  case 'development': {
    envFilePath = '.env.development.local';
    break;
  }
  case 'test': {
    envFilePath = '.env.test.local';
    break;
  }
  default: {
    Logger.log('NODE_ENV not set, using default env');
  }
}

@Module({
  imports: [ConfigModule.forRoot({ envFilePath })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
