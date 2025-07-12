import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityQueryParams } from './dto/activity-query.dto';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: ActivityQueryParams) {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      type, 
      companyId, 
      contactId, 
      opportunityId, 
      startDate, 
      endDate, 
      sortBy = 'occurredAt', 
      sortOrder = 'desc' 
    } = params;
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    // Search across details
    if (search) {
      where.details = { contains: search, mode: 'insensitive' };
    }
    
    // Filter by type
    if (type) {
      where.type = type;
    }
    
    // Filter by company
    if (companyId) {
      where.companyId = companyId;
    }
    
    // Filter by contact
    if (contactId) {
      where.contactId = contactId;
    }
    
    // Filter by opportunity
    if (opportunityId) {
      where.opportunityId = opportunityId;
    }
    
    // Date range filtering
    if (startDate || endDate) {
      where.occurredAt = {};
      if (startDate) where.occurredAt.gte = new Date(startDate);
      if (endDate) where.occurredAt.lte = new Date(endDate);
    }

    const orderBy: any = { [sortBy]: sortOrder };

    const [data, total] = await Promise.all([
      this.prisma.activity.findMany({
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
          opportunity: {
            select: {
              id: true,
              title: true,
              status: true,
              amount: true,
            },
          },
        },
      }),
      this.prisma.activity.count({ where }),
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
    return this.prisma.activity.findUnique({
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
        opportunity: {
          select: {
            id: true,
            title: true,
            status: true,
            amount: true,
          },
        },
      },
    });
  }

  async create(createActivityDto: CreateActivityDto) {
    // Convert string date to Date object if provided
    const data = {
      ...createActivityDto,
      occurredAt: createActivityDto.occurredAt ? new Date(createActivityDto.occurredAt) : new Date(),
    };

    return this.prisma.activity.create({
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
        opportunity: {
          select: {
            id: true,
            title: true,
            status: true,
            amount: true,
          },
        },
      },
    });
  }

  async update(id: number, updateActivityDto: UpdateActivityDto) {
    // Convert string date to Date object if provided
    const data = {
      ...updateActivityDto,
      occurredAt: updateActivityDto.occurredAt ? new Date(updateActivityDto.occurredAt) : undefined,
    };

    return this.prisma.activity.update({
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
        opportunity: {
          select: {
            id: true,
            title: true,
            status: true,
            amount: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.activity.delete({ where: { id } });
  }

  async bulkDelete(ids: number[]) {
    return this.prisma.activity.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async bulkUpdate(ids: number[], data: Partial<UpdateActivityDto>) {
    const updateData = {
      ...data,
      occurredAt: data.occurredAt ? new Date(data.occurredAt) : undefined,
    };

    return this.prisma.activity.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    });
  }
}
