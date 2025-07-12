import { IsString, IsNumber, IsOptional, IsDateString, IsObject, IsIn } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsIn(['call', 'email', 'meeting', 'note', 'task', 'demo', 'follow-up'])
  type: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsDateString()
  occurredAt?: string;

  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;

  @IsNumber()
  companyId: number;

  @IsOptional()
  @IsNumber()
  contactId?: number;

  @IsOptional()
  @IsNumber()
  opportunityId?: number;
}
