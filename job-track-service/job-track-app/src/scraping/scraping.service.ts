import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ScrapedJobDataDto } from './dto';
import { WttjScraper, LinkedinScraper, IndeedScraper } from './scrapers';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);

  constructor(
    private readonly wttjScraper: WttjScraper,
    private readonly linkedinScraper: LinkedinScraper,
    private readonly indeedScraper: IndeedScraper,
  ) {}

  /**
   * Scrape une offre d'emploi depuis une URL
   * Détecte automatiquement la plateforme et utilise le bon scraper
   */
async scrapeJobOffer(url: string): Promise<ScrapedJobDataDto> {
  this.logger.log(`Scraping job offer from URL: ${url}`);

  if (!this.isValidUrl(url)) {
    throw new BadRequestException('Invalid URL format');
  }

  let scraper: WttjScraper | LinkedinScraper | IndeedScraper;

  if (this.wttjScraper.canHandle(url)) {
    scraper = this.wttjScraper;
    this.logger.log('Using WTTJ scraper');
  } else if (this.linkedinScraper.canHandle(url)) {
    scraper = this.linkedinScraper;
    this.logger.log('Using LinkedIn scraper');
  } else if (this.indeedScraper.canHandle(url)) {
    scraper = this.indeedScraper;
    this.logger.log('Using Indeed scraper');
  } else {
    throw new BadRequestException(
      'Unsupported job platform. Supported platforms: WTTJ, LinkedIn, Indeed',
    );
  }

  const start = Date.now();
  this.logger.log('🚀 Starting scrapeJobOffer...');

  try {
    const scrapedData = await scraper.scrape(url);
    const duration = Date.now() - start;
    this.logger.log(`✅ scrapeJobOffer finished in ${duration} ms`);

    this.logger.log(`Successfully scraped job offer from ${scrapedData.platform}`);
    return scrapedData;
  } catch (error) {
    const duration = Date.now() - start;
    this.logger.error(
      `❌ scrapeJobOffer failed after ${duration} ms: ${error.message}`,
      error.stack,
    );
    throw new BadRequestException(`Failed to scrape job offer: ${error.message}`);
  }
}


  /**
   * Valide qu'une chaîne est une URL valide
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Retourne la liste des plateformes supportées
   */
  getSupportedPlatforms(): string[] {
    return ['WTTJ (Welcome to the Jungle)', 'LinkedIn', 'Indeed'];
  }
}
