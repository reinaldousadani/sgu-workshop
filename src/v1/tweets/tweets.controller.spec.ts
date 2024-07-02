import { Test, TestingModule } from '@nestjs/testing';
import { TweetsController } from './tweets.controller';
import { TweetsService } from './tweets.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

const mockTweetsService = {
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  deleteOne: jest.fn(),
  findMany: jest.fn(),
};

const mockUsersService = {
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

describe('TweetsController', () => {
  let controller: TweetsController;
  let tweetsService: typeof mockTweetsService;
  let usersService: typeof mockUsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: typeof mockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TweetsController],
      providers: [
        { provide: TweetsService, useValue: mockTweetsService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TweetsController>(TweetsController);
    tweetsService = module.get(TweetsService) as typeof mockTweetsService;
    usersService = module.get(UsersService) as typeof mockUsersService;
    jwtService = module.get(JwtService) as typeof mockJwtService;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a tweet', async () => {
      const mockCreateTweetDto = {
        content: 'Hello World',
      };
      const mockRequestObj = {
        jwtPayload: {
          username: 'username',
          sub: 1,
          id: 1,
        },
      };
      const mockUser = {
        id: 1,
        username: 'username',
        password: 'password',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      const mockTweet = {
        id: 1,
        content: 'Lorem Ipsum',
        userId: 1,
        createdAt: '2024-07-01T17:48:20.611Z',
        updatedAt: null,
        deletedAt: null,
      };
      usersService.findOne.mockResolvedValue(mockUser);
      tweetsService.create.mockResolvedValue(mockTweet);

      const result = await controller.create(
        mockCreateTweetDto,
        mockRequestObj,
      );
      expect(result).toEqual(mockTweet);
      expect(usersService.findOne).toHaveBeenCalledWith(
        mockRequestObj.jwtPayload.username,
      );
      expect(tweetsService.create).toHaveBeenCalledWith(
        mockCreateTweetDto,
        mockUser,
      );
    });
  });

  describe('update', () => {
    it('should successfully update a tweet', async () => {
      const mockUpdateTweetDto = {
        content: 'Edited',
      };
      const mockRequestObj = {
        jwtPayload: {
          username: 'username',
          sub: 1,
          id: 1,
        },
      };
      const mockUser = {
        id: 1,
        username: 'username',
        password: 'password',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      const mockTweet = {
        id: 1,
        content: 'Edited',
        userId: 1,
        createdAt: '2024-07-01T17:48:20.611Z',
        updatedAt: '2024-07-01T17:48:20.611Z',
        deletedAt: null,
      };
      const mockId = 1;
      usersService.findOne.mockResolvedValue(mockUser);
      tweetsService.findOne.mockResolvedValue(mockTweet);
      tweetsService.update.mockResolvedValue(mockTweet);
      const result = await controller.update(
        mockUpdateTweetDto,
        mockRequestObj,
        mockId,
      );
      expect(result).toEqual(mockTweet);
      expect(usersService.findOne).toHaveBeenCalledWith(
        mockRequestObj.jwtPayload.username,
      );
      expect(tweetsService.findOne).toHaveBeenCalledWith(mockId);
      expect(tweetsService.update).toHaveBeenCalledWith(
        mockUpdateTweetDto,
        mockId,
      );
    });
  });
  describe('delete', () => {
    it('should successfully delete a tweet', async () => {
      const mockRequestObj = {
        jwtPayload: {
          username: 'username',
          sub: 1,
          id: 1,
        },
      };
      const mockId = 1;
      const mockUser = {
        id: 1,
        username: 'username',
        password: 'password',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      const mockTweet = {
        id: 1,
        content: 'Deleted',
        userId: 1,
        createdAt: '2024-07-01T17:48:20.611Z',
        updatedAt: '2024-07-01T17:48:20.611Z',
        deletedAt: '2024-07-01T17:48:20.611Z',
      };
      usersService.findOne.mockResolvedValue(mockUser);
      tweetsService.findOne.mockResolvedValue(mockTweet);
      tweetsService.deleteOne.mockResolvedValue(mockTweet);

      const result = await controller.delete(mockRequestObj, mockId);
      expect(result).toEqual(mockTweet);
      expect(usersService.findOne).toHaveBeenCalledWith(
        mockRequestObj.jwtPayload.username,
      );
      expect(tweetsService.findOne).toHaveBeenCalledWith(mockId);
      expect(tweetsService.deleteOne).toHaveBeenCalledWith(mockId);
    });
  });
  describe('findMany', () => {
    it('should successfully find many tweet', async () => {
      const mockSearchQueryParam = {
        page: 1,
      };
      const mockTweets = [
        {
          id: 1,
          content: 'Lorem Ipsum',
          userId: 1,
          createdAt: '2024-07-01T17:48:20.611Z',
          updatedAt: null,
          deletedAt: null,
        },
        {
          id: 2,
          content: 'Lorem Ipsum 2',
          userId: 2,
          createdAt: '2024-07-01T17:48:20.611Z',
          updatedAt: null,
          deletedAt: null,
        },
      ];
      tweetsService.findMany.mockResolvedValue(mockTweets);
      const result = await controller.findMany(mockSearchQueryParam);
      expect(result).toEqual(mockTweets);
      expect(tweetsService.findMany).toHaveBeenCalledWith(
        mockSearchQueryParam.page,
      );
    });
    it('should successfully find one tweet', async () => {
      const mockId = 1;
      const mockTweet = {
        id: 1,
        content: 'Lorem Ipsum',
        userId: 1,
        createdAt: '2024-07-01T17:48:20.611Z',
        updatedAt: null,
        deletedAt: null,
      };
      tweetsService.findOne.mockResolvedValue(mockTweet);
      const result = await controller.findOne(mockId);
      expect(result).toEqual(mockTweet);
      expect(tweetsService.findOne).toHaveBeenCalledWith(mockId);
    });
  });
});
