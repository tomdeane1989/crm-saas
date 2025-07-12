import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { OpportunityQueryParams } from './dto/opportunity-query.dto';

@Injectable()
export class OpportunitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: OpportunityQueryParams) {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      status, 
      companyId, 
      contactId, 
      minAmount, 
      maxAmount, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = params;
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    // Search across title
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }
    
    // Filter by status
    if (status) {
      where.status = status;
    }
    
    // Filter by company
    if (companyId) {
      where.companyId = companyId;
    }
    
    // Filter by contact
    if (contactId) {
      where.contactId = contactId;
    }
    
    // Amount range filtering
    if (minAmount !== undefined || maxAmount !== undefined) {
      where.amount = {};
      if (minAmount !== undefined) where.amount.gte = minAmount;
      if (maxAmount !== undefined) where.amount.lte = maxAmount;
    }

    const orderBy: any = { [sortBy]: sortOrder };

    const [data, total] = await Promise.all([
      this.prisma.opportunity.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              industry: true,
            },
          },
          contact: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: {
              activities: true,
            },
          },
        },
      }),
      this.prisma.opportunity.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
          },
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        activities: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async create(createOpportunityDto: CreateOpportunityDto) {
    // Convert string date to Date object if provided
    const data = {
      ...createOpportunityDto,
      closeDate: createOpportunityDto.closeDate ? new Date(createOpportunityDto.closeDate) : undefined,
    };

    return this.prisma.opportunity.create({
      data,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
          },
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: number, updateOpportunityDto: UpdateOpportunityDto) {
    // Convert string date to Date object if provided
    const data = {
      ...updateOpportunityDto,
      closeDate: updateOpportunityDto.closeDate ? new Date(updateOpportunityDto.closeDate) : undefined,
    };

    return this.prisma.opportunity.update({
      where: { id },
      data,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
          },
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.opportunity.delete({ where: { id } });
  }

  async bulkDelete(ids: number[]) {
    return this.prisma.opportunity.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async bulkUpdate(ids: number[], data: Partial<UpdateOpportunityDto>) {
    const updateData = {
      ...data,
      closeDate: data.closeDate ? new Date(data.closeDate) : undefined,
    };

    return this.prisma.opportunity.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    });
  }
}
