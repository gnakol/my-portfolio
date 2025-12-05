import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidacy } from './entities/candidacy.entity';
import { Company } from '../company/entities/company.entity';
import { JobOffer } from '../job-offer/entities/job-offer.entity';
import { CandidacyService } from './candidacy.service';
import { CandidacyController } from './candidacy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Candidacy, Company, JobOffer])],
  controllers: [CandidacyController],
  providers: [CandidacyService],
  exports: [CandidacyService],
})
export class CandidacyModule {}
