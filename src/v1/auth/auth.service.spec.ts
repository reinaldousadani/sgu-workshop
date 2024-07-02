import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

const mockUsersService = {
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: typeof mockUsersService;
  let jwtService: typeof mockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService) as typeof mockUsersService;
    jwtService = module.get(JwtService) as typeof mockJwtService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without "password" field if user is valid', async () => {
      const username = 'testuser';
      const password = 'password';
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'password',
        createdAt: '2024-07-01T17:48:20.611Z',
        updatedAt: null,
        deletedAt: null,
      };
      usersService.findOne.mockResolvedValue(mockUser);
      const result = await service.validateUser(username, password);
      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        createdAt: '2024-07-01T17:48:20.611Z',
        updatedAt: null,
        deletedAt: null,
      });
      expect(usersService.findOne).toHaveBeenCalledWith(username);
    });
    it('should return null if password dont match', async () => {
      const username = 'username';
      const password = 'password';
      const mockUser = {
        id: 1,
        username: 'username',
        password: 'dontmatch',
        createdAt: '2024-07-01T17:48:20.611Z',
        updatedAt: null,
        deletedAt: null,
      };
      usersService.findOne.mockResolvedValue(mockUser);
      const result = await service.validateUser(username, password);
      expect(result).toEqual(null);
      expect(usersService.findOne).toHaveBeenCalledWith(username);
    });
  });

  describe('login', () => {
    it('should return access_token object', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'password',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      jwtService.sign.mockReturnValue('jwtAccessToken');
      const result = await service.login(mockUser);
      expect(result).toEqual({ access_token: 'jwtAccessToken' });
    });
  });
});
