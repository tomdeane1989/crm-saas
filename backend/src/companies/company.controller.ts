// backend/src/companies/company.controller.ts
import { Controller, Get } from '@nestjs/common';
import { CompaniesService } from './company.service';
import { Company } from '@prisma/client';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly service: CompaniesService) {}

  @Get()
  findAll(): Promise<Company[]> {
    return this.service.findAll();
  }
}