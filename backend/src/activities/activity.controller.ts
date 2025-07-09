// backend/src/activities/activity.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ActivitiesService } from './activity.service';
import { Activity } from '@prisma/client';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Get()
  findAll(): Promise<Activity[]> {
    return this.service.findAll();
  }
}