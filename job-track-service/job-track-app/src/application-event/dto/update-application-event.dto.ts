import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationEventDto } from './create-application-event.dto';

export class UpdateApplicationEventDto extends PartialType(CreateApplicationEventDto) {}
