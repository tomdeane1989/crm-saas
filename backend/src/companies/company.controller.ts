// backend/src/companies/company.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CompaniesService } from './company.service';
import { Company } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/create-company.dto';
import { CompanyQueryParams } from './dto/company-query.dto';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly service: CompaniesService) {}

  @Get()
  findAll(@Query() query: CompanyQueryParams) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.service.create(createCompanyDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.service.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  bulkDelete(@Body() { ids }: { ids: number[] }) {
    return this.service.bulkDelete(ids);
  }

  @Put('bulk-update')
  bulkUpdate(
    @Body() { ids, data }: { ids: number[]; data: Partial<UpdateCompanyDto> },
  ) {
    return this.service.bulkUpdate(ids, data);
  }
}
