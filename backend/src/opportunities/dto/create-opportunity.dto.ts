import { IsString, IsNumber, IsOptional, IsDateString, IsObject, IsIn } from 'class-validator';

export class CreateOpportunityDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsString()
  @IsIn(['prospect', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'])
  status: string;

  @IsOptional()
  @IsDateString()
  closeDate?: string;

  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;

  @IsNumber()
  companyId: number;

  @IsOptional()
  @IsNumber()
  contactId?: number;
}
