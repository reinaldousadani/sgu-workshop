import { Module } from '@nestjs/common';
import { FollowMapsService } from './follow-maps.service';
import { FollowMapsController } from './follow-maps.controller';

@Module({
  controllers: [FollowMapsController],
  providers: [FollowMapsService],
})
export class FollowMapsModule {}
