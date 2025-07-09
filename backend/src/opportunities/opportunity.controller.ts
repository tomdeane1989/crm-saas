// backend/src/opportunities/opportunity.controller.ts
import { Controller, Get } from '@nestjs/common';
import { OpportunitiesService } from './opportunity.service';
import { Opportunity } from '@prisma/client';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly service: OpportunitiesService) {}

  @Get()
  findAll(): Promise<Opportunity[]> {
    return this.service.findAll();
  }
}