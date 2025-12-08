import axios from 'axios';
import * as cheerio from 'cheerio';
import { Injectable, Logger } from '@nestjs/common';
import { ScrapedJobDataDto } from '../dto';

@Injectable()
export class IndeedScraper {
  private readonly logger = new Logger(IndeedScraper.name);

  async scrape(url: string): Promise<ScrapedJobDataDto> {
    try {
      this.logger.log(`Scraping Indeed job from: ${url}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);

      // Sélecteurs Indeed
      const title = $('h1.jobsearch-JobInfoHeader-title').text().trim() ||
                    $('.jobTitle').text().trim();

      const companyName = $('[data-company-name="true"]').text().trim() ||
                          $('.companyName').text().trim();

      const location = $('[data-testid="job-location"]').text().trim() ||
                       $('.jobLocation').text().trim();

      const description = $('#jobDescriptionText').html() ||
                          $('.jobDescription').html();

      // Extraction du salaire
      const salaryText = $('.salary-snippet').text() ||
                         $('.attribute_snippet').text();

      let minSalary: number | undefined;
      let maxSalary: number | undefined;

      if (salaryText) {
        const salaryMatch = salaryText.match(/(\d+)\s*€?\s*-\s*(\d+)\s*€?/i);
        if (salaryMatch) {
          minSalary = parseInt(salaryMatch[1]);
          maxSalary = parseInt(salaryMatch[2]);
        }
      }

      // Type de contrat
      const contractType = $('[data-testid="job-type"]').text().trim() ||
                           $('.metadata').text().trim();

      // Technologies (dans les mots-clés ou la description)
      const technologies: string[] = [];
      $('.keyword, .skill').each((_, el) => {
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
        platform: 'Indeed',
        sourceUrl: url,
        technologies: technologies.length > 0 ? technologies : undefined,
        rawData: {
          scrapedAt: new Date().toISOString(),
          htmlLength: response.data.length,
        },
      };
    } catch (error) {
      this.logger.error(`Error scraping Indeed job: ${error.message}`);
      throw new Error(`Failed to scrape Indeed job: ${error.message}`);
    }
  }

  canHandle(url: string): boolean {
    return url.includes('indeed.com') || url.includes('indeed.fr');
  }
}
