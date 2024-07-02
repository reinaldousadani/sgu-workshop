import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { PrismaService } from '../../prisma.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [TweetsController],
  providers: [TweetsService, PrismaService],
  exports: [TweetsService],
  imports: [UsersModule, JwtModule],
})
export class TweetsModule {}
