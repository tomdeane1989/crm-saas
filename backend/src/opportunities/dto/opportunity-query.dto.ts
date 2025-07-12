import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class OpportunityQueryParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  companyId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  contactId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxAmount?: number;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export interface OpportunityFilters {
  page: number;
  limit: number;
  search: string;
  status: string;
  companyId?: number;
  contactId?: number;
  minAmount?: number;
  maxAmount?: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}