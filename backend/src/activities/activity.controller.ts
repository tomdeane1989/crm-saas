import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { ActivitiesService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActivityQueryParams } from './dto/activity-query.dto';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Get()
  findAll(@Query() query: ActivityQueryParams) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.service.create(createActivityDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActivityDto: UpdateActivityDto
  ) {
    return this.service.update(id, updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post('bulk-delete')
  bulkDelete(@Body() { ids }: { ids: number[] }) {
    return this.service.bulkDelete(ids);
  }

  @Patch('bulk-update')
  bulkUpdate(@Body() { ids, data }: { ids: number[]; data: Partial<UpdateActivityDto> }) {
    return this.service.bulkUpdate(ids, data);
  }
}
