import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerAccessToken: string = request.cookies['access_token'];

    if (!bearerAccessToken) {
      throw new UnauthorizedException();
    }

    try {
      const accessToken = bearerAccessToken?.replace('Bearer ', '');
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET,
      });
      request['jwtPayload'] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
