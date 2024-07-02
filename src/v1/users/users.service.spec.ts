import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService) as typeof mockPrismaService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password',
      };
      const createdUser = {
        id: 1,
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      prisma.user.create.mockResolvedValue(createdUser);
      const result = await service.create(createUserDto);
      expect(result).toEqual(createdUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          createdAt: expect.any(Date),
          updatedAt: null,
          deletedAt: null,
        },
      });
    });
    it('should throw an error if create user fails', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password',
      };
      prisma.user.create.mockRejectedValue(new Error('Create user error'));
      await expect(service.create(createUserDto)).rejects.toThrow(
        'Create user error',
      );
    });
  });

  describe('findOne', () => {
    it('should find an user by username', async () => {
      const username = 'testuser';
      const user: User = {
        id: 1,
        username: 'testuser',
        password: 'password',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne(username);
      expect(result).toEqual(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username },
      });
    });
    it('should throw an error if findOne user fails', async () => {
      const username = 'testuser';
      prisma.user.findUnique.mockRejectedValue(
        new Error('Error while finding one user'),
      );
      await expect(service.findOne(username)).rejects.toThrow(
        'Error while finding one user',
      );
    });
  });
});
