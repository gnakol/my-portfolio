import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOffer } from './entities/job-offer.entity';
import { JobOfferService } from './job-offer.service';
import { JobOfferController } from './job-offer.controller';
import { ScrapingModule } from '../scraping/scraping.module';

@Module({
  imports: [TypeOrmModule.forFeature([JobOffer]), ScrapingModule],
  controllers: [JobOfferController],
  providers: [JobOfferService],
  exports: [JobOfferService],
})
export class JobOfferModule {}
