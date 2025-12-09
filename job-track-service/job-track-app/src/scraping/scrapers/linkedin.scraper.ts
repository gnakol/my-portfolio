import { Injectable, Logger } from '@nestjs/common';
import { ScrapedJobDataDto } from '../dto';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Ajouter le plugin stealth pour éviter la détection
puppeteer.use(StealthPlugin());

@Injectable()
export class LinkedinScraper {
  private readonly logger = new Logger(LinkedinScraper.name);

  async scrape(url: string): Promise<ScrapedJobDataDto> {
    let browser;
    try {
      this.logger.log(`🔍 Scraping LinkedIn job from: ${url}`);

      // Lancer Puppeteer avec des options anti-détection
      browser = await puppeteer.launch({
        headless: true, // Mode headless (sans interface graphique)
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

      // Désactiver les images et CSS pour accélérer (optionnel)
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Naviguer vers l'URL
      this.logger.log('🌐 Chargement de la page...');
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Attendre que le contenu principal soit chargé
      await page.waitForSelector('body', { timeout: 10000 });

      // Petit délai pour éviter d'être détecté comme bot
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Extraire les données avec plusieurs sélecteurs (LinkedIn change souvent)
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
          'h1.top-card-layout__title',
          'h2.topcard__title',
          'h1.t-24',
          '.job-details-jobs-unified-top-card__job-title h1',
        ]);

        // Nom de l'entreprise
        const companyName = getText([
          'a.topcard__org-name-link',
          '.topcard__flavor--black-link',
          'a.ember-view.t-black',
          '.job-details-jobs-unified-top-card__company-name a',
        ]);

        // Localisation
        const location = getText([
          '.topcard__flavor--bullet',
          '.job-details-jobs-unified-top-card__bullet',
          'span.topcard__flavor.topcard__flavor--bullet',
        ]);

        // Description
        const description = getHTML([
          '.show-more-less-html__markup',
          '.description__text',
          '.jobs-description__content',
          '.jobs-box__html-content',
        ]);

        // Type de contrat
        const contractType = getText([
          '.job-criteria__text--criteria',
          'li.job-criteria__item span.ui-label',
        ]);

        // Secteur de l'entreprise
        const companySector = getText([
          '.job-details-jobs-unified-top-card__job-insight span',
          '.topcard__flavor.topcard__flavor--metadata',
        ]);

        // Site web de l'entreprise (parfois disponible)
        const companyWebsiteElement = document.querySelector<HTMLAnchorElement>(
          'a[data-tracking-control-name="company-website"]'
        );
        const companyWebsite = companyWebsiteElement?.href || '';

        // Salaire (très rare sur LinkedIn)
        const salaryText = getText(['.compensation', '.salary-main-rail__salary']);

        // Remote/Télétravail
        let remoteMode = '';
        const criteria = Array.from(document.querySelectorAll('.job-criteria__text'));
        for (const el of criteria) {
          const text = el.textContent?.toLowerCase() || '';
          if (text.includes('remote') || text.includes('télétravail') || text.includes('distance')) {
            remoteMode = el.textContent?.trim() || '';
            break;
          }
        }

        // Technologies (skills)
        const technologies: string[] = [];
        const skillElements = document.querySelectorAll('[data-tracking-control-name*="skill"]');
        skillElements.forEach((el) => {
          const tech = el.textContent?.trim();
          if (tech) technologies.push(tech);
        });

        return {
          title,
          companyName,
          location,
          description,
          contractType,
          companySector,
          companyWebsite,
          salaryText,
          remoteMode,
          technologies,
        };
      });

      // Traiter le salaire (chercher dans le champ dédié ou dans la description)
      let minSalary: number | undefined;
      let maxSalary: number | undefined;

      // D'abord chercher dans le champ salaire dédié
      if (jobData.salaryText) {
        const salaryMatch = jobData.salaryText.match(/(\d+)\s*k?\s*-\s*(\d+)\s*k?/i);
        if (salaryMatch) {
          minSalary = parseInt(salaryMatch[1]) * 1000;
          maxSalary = parseInt(salaryMatch[2]) * 1000;
        }
      }

      // Si pas trouvé, chercher dans la description
      // Patterns : "40k et 55k", "40k - 55k", "entre 40k et 55k€", "40 000€ - 55 000€"
      if (!minSalary && !maxSalary && jobData.description) {
        const descriptionText = jobData.description.replace(/<[^>]*>/g, ' '); // Retirer les balises HTML

        // Pattern 1: "entre 40k et 55k" ou "entre 40 et 55k"
        let salaryMatch = descriptionText.match(/entre\s+(\d+)\s*k?\s+et\s+(\d+)\s*k/i);
        if (salaryMatch) {
          minSalary = parseInt(salaryMatch[1]) * 1000;
          maxSalary = parseInt(salaryMatch[2]) * 1000;
        }

        // Pattern 2: "40k - 55k" ou "40 - 55k"
        if (!salaryMatch) {
          salaryMatch = descriptionText.match(/(\d+)\s*k?\s*[-–]\s*(\d+)\s*k/i);
          if (salaryMatch) {
            minSalary = parseInt(salaryMatch[1]) * 1000;
            maxSalary = parseInt(salaryMatch[2]) * 1000;
          }
        }

        // Pattern 3: "40 000€ - 55 000€" (avec espaces)
        if (!salaryMatch) {
          salaryMatch = descriptionText.match(/(\d+)\s*\d{3}\s*€?\s*[-–]\s*(\d+)\s*\d{3}\s*€?/i);
          if (salaryMatch) {
            minSalary = parseInt(salaryMatch[1] + salaryMatch[2].replace(/\s/g, ''));
            maxSalary = parseInt(salaryMatch[3] + salaryMatch[4].replace(/\s/g, ''));
          }
        }
      }

      // Extraire ville et pays de la localisation
      const locationParts = jobData.location.split(',').map(p => p.trim());
      let locationCity = locationParts[0] || undefined;
      let locationCountry = locationParts[locationParts.length - 1] || undefined;

      // Si la localisation ne contient pas explicitement le pays, on essaie de le déduire
      if (locationParts.length === 1) {
        // Si on a juste "Paris" ou "Lille", on ajoute France
        locationCountry = 'France';
      } else if (locationParts.length === 2) {
        // Format "Paris, Île-de-France" -> on considère que c'est France
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
      } else if (locationParts.length >= 3) {
        // Format "Paris, Île-de-France, France" -> on prend le dernier
        locationCity = locationParts[0];
        locationCountry = locationParts[locationParts.length - 1];
      }

      this.logger.log(`✅ Scraping réussi: ${jobData.title}`);

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
        platform: 'LinkedIn',
        sourceUrl: url,
        technologies: jobData.technologies.length > 0 ? jobData.technologies : undefined,
        rawData: {
          scrapedAt: new Date().toISOString(),
          method: 'puppeteer-stealth',
          note: 'LinkedIn scraping avec Puppeteer + Stealth plugin',
        },
      };
    } catch (error) {
      this.logger.error(`❌ Error scraping LinkedIn job: ${error.message}`);
      this.logger.error(error.stack);

      // LinkedIn bloque souvent le scraping
      return {
        title: '⚠️ Scraping bloqué par LinkedIn',
        platform: 'LinkedIn',
        sourceUrl: url,
        rawData: {
          error: error.message,
          note: 'LinkedIn bloque activement le scraping. Solutions: 1) Utiliser l\'API officielle, 2) Connexion avec compte LinkedIn, 3) Saisie manuelle.',
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
    return url.includes('linkedin.com/jobs') || url.includes('linkedin.com/job');
  }
}
