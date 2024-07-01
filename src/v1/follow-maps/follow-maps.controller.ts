import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FollowMapsService } from './follow-maps.service';
import { CreateFollowMapDto } from './dto/create-follow-map.dto';
import { UpdateFollowMapDto } from './dto/update-follow-map.dto';

@Controller('follow-maps')
export class FollowMapsController {
  constructor(private readonly followMapsService: FollowMapsService) {}

  @Post()
  create(@Body() createFollowMapDto: CreateFollowMapDto) {
    return this.followMapsService.create(createFollowMapDto);
  }

  @Get()
  findAll() {
    return this.followMapsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.followMapsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFollowMapDto: UpdateFollowMapDto) {
    return this.followMapsService.update(+id, updateFollowMapDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followMapsService.remove(+id);
  }
}
