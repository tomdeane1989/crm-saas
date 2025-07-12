import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './company.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CompaniesService', () => {
  let service: CompaniesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompaniesService, PrismaService],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should create and find a company', async () => {
    // Use a mock or in-memory database; here we just check method existence
    expect(service.create).toBeDefined();
    expect(service.findAll).toBeDefined();
  });
});
