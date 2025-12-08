import axios from 'axios';
import * as cheerio from 'cheerio';
import { Injectable, Logger } from '@nestjs/common';
import { ScrapedJobDataDto } from '../dto';

@Injectable()
export class LinkedinScraper {
  private readonly logger = new Logger(LinkedinScraper.name);

  async scrape(url: string): Promise<ScrapedJobDataDto> {
    try {
      this.logger.log(`Scraping LinkedIn job from: ${url}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);

      // LinkedIn a des sélecteurs spécifiques
      const title = $('h1.top-card-layout__title').text().trim() ||
                    $('h2.topcard__title').text().trim();

      const companyName = $('a.topcard__org-name-link').text().trim() ||
                          $('.topcard__flavor--black-link').text().trim();

      const location = $('.topcard__flavor--bullet').text().trim() ||
                       $('.job-details-jobs-unified-top-card__primary-description-container span').text().trim();

      const description = $('.show-more-less-html__markup').html() ||
                          $('.description__text').html();

      // LinkedIn affiche rarement le salaire publiquement
      // On essaie quand même
      const salaryText = $('.compensation').text() || '';
      let minSalary: number | undefined;
      let maxSalary: number | undefined;

      if (salaryText) {
        const salaryMatch = salaryText.match(/(\d+)\s*k?\s*-\s*(\d+)\s*k?/i);
        if (salaryMatch) {
          minSalary = parseInt(salaryMatch[1]) * 1000;
          maxSalary = parseInt(salaryMatch[2]) * 1000;
        }
      }

      // Type de contrat (peut être dans les critères)
      const contractType = $('.job-criteria__text--criteria').first().text().trim();

      // Mode de travail
      let remoteMode: string | undefined;
      $('.job-criteria__text').each((_, el) => {
        const text = $(el).text().trim().toLowerCase();
        if (text.includes('remote') || text.includes('télétravail')) {
          remoteMode = text;
        }
      });

      // Technologies
      const technologies: string[] = [];
      $('[data-tracking-control-name*="skill"]').each((_, el) => {
        const tech = $(el).text().trim();
        if (tech) technologies.push(tech);
      });

      return {
        title: title || undefined,
        companyName: companyName || undefined,
        description: description || undefined,
        locationCity: location || undefined,
        minSalary,
        maxSalary,
        typeOfContract: contractType || undefined,
        remoteMode: remoteMode || undefined,
        platform: 'LinkedIn',
        sourceUrl: url,
        technologies: technologies.length > 0 ? technologies : undefined,
        rawData: {
          scrapedAt: new Date().toISOString(),
          note: 'LinkedIn may require authentication for full details',
        },
      };
    } catch (error) {
      this.logger.error(`Error scraping LinkedIn job: ${error.message}`);

      // LinkedIn bloque souvent le scraping, on retourne des données partielles
      return {
        title: 'Unable to scrape (LinkedIn requires authentication)',
        platform: 'LinkedIn',
        sourceUrl: url,
        rawData: {
          error: error.message,
          note: 'LinkedIn actively blocks scraping. Consider using LinkedIn API or manual entry.',
        },
      };
    }
  }

  canHandle(url: string): boolean {
    return url.includes('linkedin.com/jobs');
  }
}
