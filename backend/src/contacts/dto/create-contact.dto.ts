export class CreateContactDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  externalId?: string;
  customFields?: Record<string, any>;
  companyId: number;
}