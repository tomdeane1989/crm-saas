export class CreateCompanyDto {
  name: string;
  industry?: string;
  website?: string;
  externalId?: string;
  customFields?: Record<string, any>;
}
