import { Injectable, Logger } from '@nestjs/common';
import { ScrapedJobDataDto } from '../dto';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Ajouter le plugin stealth pour éviter la détection
puppeteer.use(StealthPlugin());

@Injectable()
export class IndeedScraper {
  private readonly logger = new Logger(IndeedScraper.name);

  async scrape(url: string): Promise<ScrapedJobDataDto> {
    let browser;
    try {
      this.logger.log(`🔍 Scraping Indeed job from: ${url}`);

      // Lancer Puppeteer avec des options anti-détection
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-dev-shm-usage',
        ],
      });

      const page = await browser.newPage();

      // Configurer la page pour ressembler à un vrai navigateur
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      );
      await page.setViewport({ width: 1920, height: 1080 });

      // Désactiver les images et CSS pour accélérer
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Naviguer vers l'URL
      this.logger.log('🌐 Chargement de la page Indeed...');
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Attendre que le contenu principal soit chargé
      await page.waitForSelector('body', { timeout: 10000 });

      // Petit délai pour éviter d'être détecté comme bot
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Extraire les données avec plusieurs sélecteurs (Indeed change parfois)
      const jobData = await page.evaluate(() => {
        const getText = (selectors: string[]): string => {
          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element?.textContent) {
              return element.textContent.trim();
            }
          }
          return '';
        };

        const getHTML = (selectors: string[]): string => {
          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element?.innerHTML) {
              return element.innerHTML.trim();
            }
          }
          return '';
        };

        // Titre du poste
        const title = getText([
          'h1.jobsearch-JobInfoHeader-title',
          '.jobTitle',
          'h1[data-testid="jobTitle"]',
          'h1.jobsearch-JobInfoHeader-title span',
        ]);

        // Nom de l'entreprise
        const companyName = getText([
          '[data-company-name="true"]',
          '.companyName',
          '[data-testid="inlineHeader-companyName"]',
          '.css-1saizt3',
        ]);

        // Localisation
        const location = getText([
          '[data-testid="job-location"]',
          '.jobLocation',
          '.companyLocation',
          '[data-testid="inlineHeader-companyLocation"]',
        ]);

        // Description
        const description = getHTML([
          '#jobDescriptionText',
          '.jobDescription',
          '[id*="jobDescriptionText"]',
          '.jobsearch-jobDescriptionText',
        ]);

        // Salaire
        const salaryText = getText([
          '.salary-snippet',
          '.attribute_snippet',
          '#salaryInfoAndJobType',
          '[data-testid="detailsSection-salary"]',
          '.css-5bafjm',
        ]);

        // Type de contrat
        const contractType = getText([
          '[data-testid="job-type"]',
          '.metadata',
          '#salaryInfoAndJobType span',
          '.jobsearch-JobMetadataHeader-item',
        ]);

        // Secteur de l'entreprise (si disponible)
        const companySector = getText([
          '[data-testid="companyInfo-industry"]',
          '.jobsearch-CompanyInfoWithoutHeaderImage div',
        ]);

        // Site web de l'entreprise (parfois disponible)
        const companyWebsiteElement = document.querySelector<HTMLAnchorElement>(
          '[data-testid="companyInfo-website"] a'
        );
        const companyWebsite = companyWebsiteElement?.href || '';

        // Remote/Télétravail (chercher dans le texte)
        let remoteMode = '';
        const jobMetadata = document.querySelectorAll('.jobsearch-JobMetadataHeader-item');
        for (const el of jobMetadata) {
          const text = el.textContent?.toLowerCase() || '';
          if (text.includes('remote') || text.includes('télétravail') || text.includes('distance')) {
            remoteMode = el.textContent?.trim() || '';
            break;
          }
        }

        // Technologies (chercher les skills/keywords dans la page)
        const technologies: string[] = [];
        const skillElements = document.querySelectorAll('.keyword, .skill, [data-testid="skill"]');
        skillElements.forEach((el) => {
          const tech = el.textContent?.trim();
          if (tech && tech.length > 2) technologies.push(tech);
        });

        return {
          title,
          companyName,
          location,
          description,
          salaryText,
          contractType,
          companySector,
          companyWebsite,
          remoteMode,
          technologies,
        };
      });

      // Traiter le salaire (chercher dans le champ dédié ou dans la description)
      let minSalary: number | undefined;
      let maxSalary: number | undefined;

      // D'abord chercher dans le champ salaire dédié
      if (jobData.salaryText) {
        // Pattern 1: "30000 - 45000 €" ou "30 000 - 45 000€"
        let salaryMatch = jobData.salaryText.match(/(\d+[\s]?\d*)\s*[-–]\s*(\d+[\s]?\d*)\s*€/i);
        if (salaryMatch) {
          minSalary = parseInt(salaryMatch[1].replace(/\s/g, ''));
          maxSalary = parseInt(salaryMatch[2].replace(/\s/g, ''));
        }

        // Pattern 2: "30k - 45k"
        if (!salaryMatch) {
          salaryMatch = jobData.salaryText.match(/(\d+)\s*k?\s*[-–]\s*(\d+)\s*k/i);
          if (salaryMatch) {
            minSalary = parseInt(salaryMatch[1]) * 1000;
            maxSalary = parseInt(salaryMatch[2]) * 1000;
          }
        }
      }

      // Si pas trouvé, chercher dans la description
      if (!minSalary && !maxSalary && jobData.description) {
        const descriptionText = jobData.description.replace(/<[^>]*>/g, ' ');

        // Pattern 1: "entre 30k et 45k" ou "entre 30 et 45k"
        let salaryMatch = descriptionText.match(/entre\s+(\d+)\s*k?\s+et\s+(\d+)\s*k/i);
        if (salaryMatch) {
          minSalary = parseInt(salaryMatch[1]) * 1000;
          maxSalary = parseInt(salaryMatch[2]) * 1000;
        }

        // Pattern 2: "30 000€ - 45 000€"
        if (!salaryMatch) {
          salaryMatch = descriptionText.match(/(\d+)\s*\d{3}\s*€?\s*[-–]\s*(\d+)\s*\d{3}\s*€?/i);
          if (salaryMatch) {
            minSalary = parseInt(salaryMatch[0].match(/\d+/g)?.[0] + salaryMatch[0].match(/\d+/g)?.[1] || '0');
            maxSalary = parseInt(salaryMatch[0].match(/\d+/g)?.[2] + salaryMatch[0].match(/\d+/g)?.[3] || '0');
          }
        }
      }

      // Extraire ville et pays de la localisation
      const locationParts = jobData.location.split(',').map(p => p.trim());
      let locationCity = locationParts[0] || undefined;
      let locationCountry = locationParts[locationParts.length - 1] || undefined;

      // Indeed France : si pas de pays explicite, on met France
      if (url.includes('indeed.fr') && locationParts.length <= 2) {
        locationCountry = 'France';
      }

      // Détecter les régions françaises
      if (locationParts.length === 2) {
        if (locationParts[1].includes('Île-de-France') ||
            locationParts[1].includes('Auvergne') ||
            locationParts[1].includes('Nouvelle-Aquitaine') ||
            locationParts[1].includes('Occitanie') ||
            locationParts[1].includes('Hauts-de-France') ||
            locationParts[1].includes('Grand Est') ||
            locationParts[1].includes('Bourgogne') ||
            locationParts[1].includes('Bretagne') ||
            locationParts[1].includes('Centre-Val') ||
            locationParts[1].includes('Corse') ||
            locationParts[1].includes('Normandie') ||
            locationParts[1].includes('Pays de la Loire') ||
            locationParts[1].includes('Provence-Alpes')) {
          locationCountry = 'France';
        }
      }

      this.logger.log(`✅ Scraping Indeed réussi: ${jobData.title}`);

      return {
        title: jobData.title || undefined,
        companyName: jobData.companyName || undefined,
        companySector: jobData.companySector || undefined,
        companyWebsite: jobData.companyWebsite || undefined,
        description: jobData.description || undefined,
        locationCity,
        locationCountry,
        minSalary,
        maxSalary,
        typeOfContract: jobData.contractType || undefined,
        remoteMode: jobData.remoteMode || undefined,
        platform: 'Indeed',
        sourceUrl: url,
        technologies: jobData.technologies.length > 0 ? jobData.technologies : undefined,
        rawData: {
          scrapedAt: new Date().toISOString(),
          method: 'puppeteer-stealth',
          note: 'Indeed scraping avec Puppeteer + Stealth plugin',
        },
      };
    } catch (error) {
      this.logger.error(`❌ Error scraping Indeed job: ${error.message}`);
      this.logger.error(error.stack);

      return {
        title: '⚠️ Erreur lors du scraping Indeed',
        platform: 'Indeed',
        sourceUrl: url,
        rawData: {
          error: error.message,
          note: 'Erreur lors du scraping Indeed. Vérifiez l\'URL ou essayez la saisie manuelle.',
        },
      };
    } finally {
      if (browser) {
        await browser.close();
        this.logger.log('🔒 Navigateur fermé');
      }
    }
  }

  canHandle(url: string): boolean {
    return url.includes('indeed.com') || url.includes('indeed.fr');
  }
}
