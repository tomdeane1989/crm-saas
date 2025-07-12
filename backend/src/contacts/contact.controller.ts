import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { ContactsService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContactQueryParams } from './dto/contact-query.dto';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly service: ContactsService) {}

  @Get()
  findAll(@Query() query: ContactQueryParams) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.service.create(createContactDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactDto: UpdateContactDto
  ) {
    return this.service.update(id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post('bulk-delete')
  bulkDelete(@Body() { ids }: { ids: number[] }) {
    return this.service.bulkDelete(ids);
  }

  @Patch('bulk-update')
  bulkUpdate(@Body() { ids, data }: { ids: number[]; data: Partial<UpdateContactDto> }) {
    return this.service.bulkUpdate(ids, data);
  }
}
