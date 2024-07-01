import { Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { PrismaService } from 'src/prisma.service';
import User from '../users/entities/user.entity';
import { UpdateTweetDto } from './dto/update-tweet.dto';

const DATA_PER_PAGE = 20;

@Injectable()
export class TweetsService {
  constructor(private prisma: PrismaService) {}

  findMany(page: number) {
    return this.prisma.tweet.findMany({
      where: { deletedAt: null },
      skip: (page - 1) * DATA_PER_PAGE,
      take: DATA_PER_PAGE,
    });
  }

  create(createTweetDto: CreateTweetDto, user: User) {
    return this.prisma.tweet.create({
      data: {
        ...createTweetDto,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        userId: user.id,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.tweet.findUnique({
      where: { id, AND: { deletedAt: null } },
    });
  }

  update(updateTweetDto: UpdateTweetDto, id: number) {
    return this.prisma.tweet.update({
      where: { id, AND: { deletedAt: null } },
      data: { ...updateTweetDto, updatedAt: new Date() },
    });
  }

  deleteOne(id: number) {
    return this.prisma.tweet.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
