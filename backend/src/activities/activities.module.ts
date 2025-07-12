import { Module } from '@nestjs/common';
import { ActivitiesService } from './activity.service';
import { ActivitiesController } from './activity.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  imports: [PrismaModule],
})
export class ActivitiesModule {}
