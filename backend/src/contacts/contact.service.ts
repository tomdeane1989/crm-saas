import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactQueryParams } from './dto/contact-query.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: ContactQueryParams) {
    const { page = 1, limit = 20, search, role, companyId, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    // Search across name and email
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Filter by role
    if (role) {
      where.role = { contains: role, mode: 'insensitive' };
    }
    
    // Filter by company
    if (companyId) {
      where.companyId = companyId;
    }

    const orderBy: any = { [sortBy]: sortOrder };

    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
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
          _count: {
            select: {
              activities: true,
            },
          },
        },
      }),
      this.prisma.contact.count({ where }),
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
    return this.prisma.contact.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
          },
        },
        activities: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async create(createContactDto: CreateContactDto) {
    return this.prisma.contact.create({
      data: createContactDto,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
          },
        },
      },
    });
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    return this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.contact.delete({ where: { id } });
  }

  async bulkDelete(ids: number[]) {
    return this.prisma.contact.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async bulkUpdate(ids: number[], data: Partial<UpdateContactDto>) {
    return this.prisma.contact.updateMany({
      where: { id: { in: ids } },
      data,
    });
  }
}
