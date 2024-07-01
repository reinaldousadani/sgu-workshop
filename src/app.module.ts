import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TweetsModule } from './v1/tweets/tweets.module';
import { UsersModule } from './v1/users/users.module';
import { AuthModule } from './v1/auth/auth.module';

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
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    AuthModule,
    TweetsModule,
    UsersModule,
  ],
})
export class AppModule {}
