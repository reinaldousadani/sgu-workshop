import { Test, TestingModule } from '@nestjs/testing';
import { FollowMapsController } from './follow-maps.controller';
import { FollowMapsService } from './follow-maps.service';

describe('FollowMapsController', () => {
  let controller: FollowMapsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowMapsController],
      providers: [FollowMapsService],
    }).compile();

    controller = module.get<FollowMapsController>(FollowMapsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
