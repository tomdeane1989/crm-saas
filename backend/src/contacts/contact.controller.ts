import { Controller, Get } from '@nestjs/common';
import { ContactsService } from './contact.service';
import { Contact } from '@prisma/client';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly service: ContactsService) {}

  @Get()
  findAll(): Promise<Contact[]> {
    return this.service.findAll();
  }
}