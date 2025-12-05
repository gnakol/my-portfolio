import { PartialType } from '@nestjs/mapped-types';
import { CreateStackTagDto } from './create-stack-tag.dto';

export class UpdateStackTagDto extends PartialType(CreateStackTagDto) {}
