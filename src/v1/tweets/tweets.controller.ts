import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Put,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  Delete,
  NotFoundException,
  Get,
  Query,
} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import JwtPayload from '../auth/entities/jwt-payload.entity';
import { UsersService } from '../users/users.service';
import { SearchQueryParamDto } from './dto/search-query-param.dto';

@Controller('v1/tweets')
export class TweetsController {
  constructor(
    private readonly tweetsService: TweetsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTweetDto: CreateTweetDto, @Req() req) {
    const jwtPayload = req['jwtPayload'] as JwtPayload;
    const user = await this.usersService.findOne(jwtPayload.username);
    return this.tweetsService.create(createTweetDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Body() updateTweetDto: UpdateTweetDto,
    @Req() req,
    @Param('id') id: number,
  ) {
    const jwtPayload = req['jwtPayload'] as JwtPayload;
    const user = await this.usersService.findOne(jwtPayload.username);
    const tweet = await this.tweetsService.findOne(id);
    if (!tweet) throw new NotFoundException();
    if (tweet?.userId !== user?.id || !user) throw new UnauthorizedException();
    return this.tweetsService.update(updateTweetDto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Req() req, @Param('id') id: number) {
    const jwtPayload = req['jwtPayload'] as JwtPayload;
    const user = await this.usersService.findOne(jwtPayload.username);
    const tweet = await this.tweetsService.findOne(id);
    if (!tweet) throw new NotFoundException();
    if (tweet?.userId !== user?.id || !user) throw new UnauthorizedException();
    return this.tweetsService.deleteOne(id);
  }

  @Get()
  async findMany(@Query() searchQueryParam?: SearchQueryParamDto) {
    let { page } = searchQueryParam;
    if (!page) {
      page = 1;
    }
    const tweets = await this.tweetsService.findMany(page);
    return tweets;
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id') id: number) {
    const tweet = await this.tweetsService.findOne(id);
    if (!tweet) throw new NotFoundException();
    return tweet;
  }
}
