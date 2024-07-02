import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

const mockAuthService = {
  login: jest.fn(),
};

const mockUsersService = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: typeof mockAuthService;
  let usersService: typeof mockUsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: typeof mockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService) as typeof mockAuthService;
    usersService = module.get(UsersService) as typeof mockUsersService;
    jwtService = module.get(JwtService) as typeof mockJwtService;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should properly login user', async () => {
      const mockRequest = {
        user: {
          id: 1,
          username: 'username',
          password: 'password',
          createdAt: new Date(),
          updatedAt: null,
          deletedAt: null,
        },
      };
      const mockResponse = {
        cookie: jest.fn(
          (
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            key: string,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            value: string,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            options: Record<string, any>,
          ) => {},
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        status: jest.fn((statusCode: number) => {
          return { send: (...a: any) => a };
        }),
      };
      authService.login.mockResolvedValue({
        access_token: 'accessToken',
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const result = await controller.login(mockRequest, mockResponse);
      expect(result).toBeDefined();
      expect(authService.login).toHaveBeenCalledWith(mockRequest.user);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        'Bearer accessToken',
        {
          expires: expect.any(Date),
          httpOnly: true,
          sameSite: 'lax',
          secure: true,
        },
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
  describe('getProfile', () => {
    it('should properly fetch user profile', async () => {
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
      usersService.findOne.mockResolvedValue(mockUser);
      const result = await controller.getProfile(mockRequestObj);
      expect(result).toEqual({
        id: 1,
        username: 'username',
        createdAt: expect.any(Date),
        updatedAt: null,
        deletedAt: null,
      });
      expect(usersService.findOne).toHaveBeenCalledWith(
        mockRequestObj.jwtPayload.username,
      );
    });
  });
  describe('signup', () => {
    it('should properly signup user', async () => {
      const mockCreateUserDto = {
        username: 'testuser',
        password: 'password',
      };
      const mockResponse = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        status: jest.fn((statusCode: number) => {
          return { send: (...a: any) => a };
        }),
      };
      usersService.create.mockResolvedValue(true);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const result = await controller.signup(mockCreateUserDto, mockResponse);
      expect(result).toBeDefined();
      expect(usersService.create).toHaveBeenCalledWith(mockCreateUserDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
  describe('logout', () => {
    it('should properly logs out user', async () => {
      const mockResponse = {
        cookie: jest.fn(
          (
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            key: string,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            value: string,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            options: Record<string, any>,
          ) => {},
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        status: jest.fn((statusCode: number) => {
          return { send: (...a: any) => a };
        }),
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const result = await controller.logout(mockResponse);
      expect(result).toBeDefined();
      expect(mockResponse.cookie).toHaveBeenCalledWith('access_token', null, {
        expires: expect.any(Date),
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});
