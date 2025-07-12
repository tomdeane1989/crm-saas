import { IsString, IsEmail, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreateContactDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;

  @IsNumber()
  companyId: number;
}
