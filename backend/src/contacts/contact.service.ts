import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Contact } from '@prisma/client';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Contact[]> {
    return this.prisma.contact.findMany();
  }

  findOne(id: number): Promise<Contact | null> {
    return this.prisma.contact.findUnique({ where: { id } });
  }

  create(createContactDto: CreateContactDto): Promise<Contact> {
    return this.prisma.contact.create({ data: createContactDto });
  }

  update(id: number, updateContactDto: UpdateContactDto): Promise<Contact> {
    return this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });
  }

  remove(id: number): Promise<Contact> {
    return this.prisma.contact.delete({ where: { id } });
  }
}