import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Company } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.prisma.company.create({ data: createCompanyDto });
  }

  findAll(): Promise<Company[]> {
    return this.prisma.company.findMany();
  }

  findOne(id: number): Promise<Company | null> {
    return this.prisma.company.findUnique({ where: { id } });
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  remove(id: number): Promise<Company> {
    return this.prisma.company.delete({ where: { id } });
  }
}