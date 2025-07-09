import { Module } from '@nestjs/common';
import { ContactsService } from './contact.service';
import { ContactsController } from './contact.controller';
import { PrismaModule } from '../prisma/prisma.module';  
@Module({
  controllers: [ContactsController],
  providers: [ContactsService],
  imports: [PrismaModule],
})
export class ContactsModule {}