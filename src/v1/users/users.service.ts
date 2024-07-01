import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      },
    });
  }

  findOne(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
}
