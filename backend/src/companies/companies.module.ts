// backend/src/companies/companies.module.ts
import { Module } from '@nestjs/common';
import { CompaniesService } from './company.service';
import { CompaniesController } from './company.controller';
import { PrismaModule } from '../prisma/prisma.module'; 
@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [PrismaModule],
})
export class CompaniesModule {}