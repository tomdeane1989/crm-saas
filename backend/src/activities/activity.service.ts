import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Activity } from '@prisma/client';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  create(createActivityDto: CreateActivityDto): Promise<Activity> {
      return this.prisma.activity.create({ data: createActivityDto });
  }

  findAll(): Promise<Activity[]> {
    return this.prisma.activity.findMany();
  }

  findOne(id: number): Promise<Activity | null> {
      return this.prisma.activity.findUnique({ where: { id } });
    }

    update(id: number, updateActivityDto: UpdateActivityDto): Promise<Activity> {
      return this.prisma.activity.update({
        where: { id },
        data: updateActivityDto,
      });
    }

    remove(id: number): Promise<Activity> {
      return this.prisma.activity.delete({ where: { id } });
    }
}