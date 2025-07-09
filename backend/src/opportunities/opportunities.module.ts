import { Module } from '@nestjs/common';
import { OpportunitiesService } from './opportunity.service';
import { OpportunitiesController } from './opportunity.controller';
import { PrismaModule } from '../prisma/prisma.module';  
@Module({
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService],
  imports: [PrismaModule],
})
export class OpportunitiesModule {}