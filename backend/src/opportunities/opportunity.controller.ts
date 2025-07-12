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
import { OpportunitiesService } from './opportunity.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OpportunityQueryParams } from './dto/opportunity-query.dto';

@Controller('opportunities')
@UseGuards(JwtAuthGuard)
export class OpportunitiesController {
  constructor(private readonly service: OpportunitiesService) {}

  @Get()
  findAll(@Query() query: OpportunityQueryParams) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() createOpportunityDto: CreateOpportunityDto) {
    return this.service.create(createOpportunityDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOpportunityDto: UpdateOpportunityDto
  ) {
    return this.service.update(id, updateOpportunityDto);
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
  bulkUpdate(@Body() { ids, data }: { ids: number[]; data: Partial<UpdateOpportunityDto> }) {
    return this.service.bulkUpdate(ids, data);
  }
}
