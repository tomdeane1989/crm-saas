import { IsString, IsOptional, IsUrl, IsObject } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;
}

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
