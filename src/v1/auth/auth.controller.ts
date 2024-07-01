import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import JwtPayload from './entities/jwt-payload.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request, @Res() response: Response) {
    try {
      const { access_token } = await this.authService.login(request.user);
      response.cookie('access_token', `Bearer ${access_token}`, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      });
      return response.status(200).send();
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() request) {
    const jwtPayload = request['jwtPayload'] as JwtPayload;
    const user = await this.usersService.findOne(jwtPayload.username);
    Logger.log('USER: ', user);
    if (user) {
      delete user.password;
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    await this.usersService.create(createUserDto);
    return res.status(200).send();
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.cookie('access_token', null, {
      expires: new Date(),
    });
    return res.status(200).send();
  }
}
