import { Test, TestingModule } from '@nestjs/testing';
import { FollowMapsService } from './follow-maps.service';

describe('FollowMapsService', () => {
  let service: FollowMapsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowMapsService],
    }).compile();

    service = module.get<FollowMapsService>(FollowMapsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
