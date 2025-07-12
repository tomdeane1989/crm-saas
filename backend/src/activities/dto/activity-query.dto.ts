import { IsOptional, IsString, IsNumber, IsIn, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class ActivityQueryParams {
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
  type?: string;

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
  opportunityId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'occurredAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export interface ActivityFilters {
  page: number;
  limit: number;
  search: string;
  type: string;
  companyId?: number;
  contactId?: number;
  opportunityId?: number;
  startDate?: string;
  endDate?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}