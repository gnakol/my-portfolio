import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { WttjScraper, LinkedinScraper, IndeedScraper } from './scrapers';

@Module({
  providers: [ScrapingService, WttjScraper, LinkedinScraper, IndeedScraper],
  exports: [ScrapingService],
})
export class ScrapingModule {}
