import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Company, Prisma } from '@prisma/client';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/create-company.dto';
import { CompanyQueryParams } from './dto/company-query.dto';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.prisma.company.create({
      data: createCompanyDto,
      include: {
        contacts: true,
        opportunities: true,
      },
    });
  }

  async findAll(
    query: CompanyQueryParams,
  ): Promise<PaginatedResponse<Company>> {
    const {
      page = 1,
      limit = 20,
      search,
      industry,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build where clause for filtering
    const where: Prisma.CompanyWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { website: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(industry && {
        industry: { contains: industry, mode: 'insensitive' },
      }),
    };

    // Build orderBy clause
    const orderBy: Prisma.CompanyOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          contacts: { take: 3 },
          opportunities: { take: 3 },
          _count: {
            select: {
              contacts: true,
              opportunities: true,
            },
          },
        },
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      data: companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        contacts: { orderBy: { createdAt: 'desc' } },
        opportunities: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    try {
      return await this.prisma.company.update({
        where: { id },
        data: updateCompanyDto,
        include: {
          contacts: true,
          opportunities: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.company.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      throw error;
    }
  }

  async bulkDelete(ids: number[]): Promise<void> {
    await this.prisma.company.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async bulkUpdate(
    ids: number[],
    data: Partial<UpdateCompanyDto>,
  ): Promise<number> {
    const result = await this.prisma.company.updateMany({
      where: { id: { in: ids } },
      data,
    });
    return result.count;
  }

  async getIndustries(): Promise<string[]> {
    const industries = await this.prisma.company.findMany({
      select: { industry: true },
      where: { industry: { not: null } },
      distinct: ['industry'],
    });
    return industries.map((c) => c.industry!).filter(Boolean);
  }
}
