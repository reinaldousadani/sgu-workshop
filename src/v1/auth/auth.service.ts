import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import User from '../users/entities/user.entity';
import JwtPayload from './entities/jwt-payload.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
      id: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
    };
  }
}
