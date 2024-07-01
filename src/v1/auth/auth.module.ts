import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UsersModule, PassportModule, JwtModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
