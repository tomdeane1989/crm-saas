export class CreateActivityDto {
  type: string;              // e.g. "call", "email", "meeting"
  details?: string;
  occurredAt?: Date;
  customFields?: Record<string, any>;
  companyId: number;
  contactId?: number;
  opportunityId?: number;
}
