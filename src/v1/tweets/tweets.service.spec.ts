import { Test, TestingModule } from '@nestjs/testing';
import { TweetsService } from './tweets.service';
import { PrismaService } from '../../prisma.service';
import { DATA_PER_PAGE } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';

const mockPrismaService = {
  tweet: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('TweetsService', () => {
  let service: TweetsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TweetsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TweetsService>(TweetsService);
    prisma = module.get(PrismaService) as typeof mockPrismaService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMany', () => {
    it('should find many tweets successfully', async () => {
      const page = 1;
      const tweets = [
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
      prisma.tweet.findMany.mockResolvedValue(tweets);

      const result = await service.findMany(page);
      expect(result).toEqual(tweets);
      expect(prisma.tweet.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        skip: page - 1,
        take: DATA_PER_PAGE,
      });
    });
    it('should throw an error if findMany tweets fails', async () => {
      const page = 1;
      prisma.tweet.findMany.mockRejectedValue(
        new Error('Error while finding many tweets'),
      );
      await expect(service.findMany(page)).rejects.toThrow(
        'Error while finding many tweets',
      );
    });
  });
  describe('create', () => {
    it('should create a tweet successfully', async () => {
      const currDate = new Date();
      const createTweetDto: CreateTweetDto = {
        content: 'Lorem Ipsum',
      };
      const user = {
        id: 1,
        username: 'testuser',
        password: 'password',
        createdAt: currDate,
        updatedAt: null,
        deletedAt: null,
      };
      const createdTweet = {
        id: 1,
        content: 'Lorem Ipsum',
        userId: 1,
        createdAt: '2024-07-01T17:48:20.611Z',
        updatedAt: null,
        deletedAt: null,
      };
      prisma.tweet.create.mockResolvedValue(createdTweet);
      const result = await service.create(createTweetDto, user);
      expect(result).toEqual(createdTweet);
      expect(prisma.tweet.create).toHaveBeenCalledWith({
        data: {
          ...createTweetDto,
          createdAt: currDate,
          updatedAt: null,
          deletedAt: null,
          userId: user.id,
        },
      });
    });
    it('should throw an error if create tweet fails', async () => {
      const currDate = new Date();
      const errMsg = 'Error';
      const createTweetDto: CreateTweetDto = {
        content: 'Lorem Ipsum',
      };
      const user = {
        id: 1,
        username: 'testuser',
        password: 'password',
        createdAt: currDate,
        updatedAt: null,
        deletedAt: null,
      };
      prisma.tweet.create.mockRejectedValue(new Error(errMsg));
      await expect(service.create(createTweetDto, user)).rejects.toThrow(
        errMsg,
      );
    });
  });
  describe('findOne', () => {
    it('should find one tweet successfully', async () => {
      const id = 1;
      const tweet = {
        id: 1,
        content: 'Lorem Ipsum',
        userId: 1,
        createdAt: '2024-07-01T17:48:20.611Z',
        updatedAt: null,
        deletedAt: null,
      };
      prisma.tweet.findUnique.mockResolvedValue(tweet);

      const result = await service.findOne(id);
      expect(result).toEqual(tweet);
      expect(prisma.tweet.findUnique).toHaveBeenCalledWith({
        where: { id, AND: { deletedAt: null } },
      });
    });
    it('should throw an error if findUnique fails', async () => {
      const id = 1;
      const errMsg = 'Error';
      prisma.tweet.findUnique.mockRejectedValue(new Error(errMsg));
      await expect(service.findOne(id)).rejects.toThrow(errMsg);
    });
  });
  describe('update', () => {
    it('should successfully update a tweet', async () => {
      const id = 1;
      const updateTweetDto: UpdateTweetDto = {
        content: 'Lorem Ipsum - Edited',
      };
      const currDate = new Date();
      const mockResult = {
        id: 1,
        content: 'Lorem Ipsum - Edited',
        userId: 1,
        createdAt: '2024-07-01T17:48:20.611Z',
        updatedAt: '2024-07-01T17:48:20.611Z',
        deletedAt: null,
      };
      prisma.tweet.update.mockResolvedValue(mockResult);

      const result = await service.update(updateTweetDto, id);
      expect(result).toEqual(mockResult);
      expect(prisma.tweet.update).toHaveBeenCalledWith({
        where: { id, AND: { deletedAt: null } },
        data: { ...updateTweetDto, updatedAt: currDate },
      });
    });
    it('should throw an error if update a tweet fails', async () => {
      const id = 1;
      const updateTweetDto: UpdateTweetDto = {
        content: 'Lorem Ipsum - Edited',
      };
      const err = new Error('Error');
      prisma.tweet.update.mockRejectedValue(err);

      await expect(service.update(updateTweetDto, id)).rejects.toThrow(err);
    });
  });
  describe('deleteOne', () => {
    it('should successfully delete one tweet', async () => {
      const id = 1;
      const mockResult = {
        id: 1,
        content: 'Lorem Ipsum - Deleted',
        userId: 1,
        createdAt: '2024-07-01T17:48:20.611Z',
        updatedAt: '2024-07-01T17:48:20.611Z',
        deletedAt: '2024-07-01T17:48:20.611Z',
      };
      prisma.tweet.update.mockResolvedValue(mockResult);

      const result = await service.deleteOne(id);
      expect(result).toEqual(mockResult);
      expect(prisma.tweet.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          deletedAt: expect.any(Date),
        },
      });
    });
    it('should throw an error if delete fails', async () => {
      const id = 1;
      const err = new Error('error');
      prisma.tweet.update.mockRejectedValue(err);
      await expect(service.deleteOne(id)).rejects.toThrow(err);
    });
  });
});
