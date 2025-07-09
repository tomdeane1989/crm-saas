import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Opportunity } from '@prisma/client';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';

@Injectable()
export class OpportunitiesService {
  constructor(private prisma: PrismaService) {}

  create(createOpportunityDto: CreateOpportunityDto): Promise<Opportunity> {
      return this.prisma.opportunity.create({ data: createOpportunityDto });
    }
  
    findAll(): Promise<Opportunity[]> {
      return this.prisma.opportunity.findMany();
    }
  
    findOne(id: number): Promise<Opportunity | null> {
      return this.prisma.opportunity.findUnique({ where: { id } });
    }
  
    update(id: number, updateOpportunityDto: UpdateOpportunityDto): Promise<Opportunity> {
      return this.prisma.opportunity.update({
        where: { id },
        data: updateOpportunityDto,
      });
    }
  
    remove(id: number): Promise<Opportunity> {
      return this.prisma.opportunity.delete({ where: { id } });
    }
  }