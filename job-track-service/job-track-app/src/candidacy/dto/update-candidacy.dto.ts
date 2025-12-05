import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidacyDto } from './create-candidacy.dto';

export class UpdateCandidacyDto extends PartialType(CreateCandidacyDto) {}
