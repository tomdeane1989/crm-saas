export class CreateOpportunityDto {
  title: string;
  amount?: number;
  status: string;
  closeDate?: Date;
  externalId?: string;
  customFields?: Record<string, any>;
  companyId: number;
  contactId?: number;
}