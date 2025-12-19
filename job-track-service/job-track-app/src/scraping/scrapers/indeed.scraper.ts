import { Injectable, Logger } from '@nestjs/common';
import { ScrapedJobDataDto } from '../dto';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as net from 'net';

// Ajouter le plugin stealth pour éviter la détection
puppeteer.use(StealthPlugin());

@Injectable()
export class IndeedScraper {
  private readonly logger = new Logger(IndeedScraper.name);

  /**
   * Renouvelle le circuit Tor pour obtenir une nouvelle IP
   */
  private async renewTorCircuit(): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();

      socket.connect(9051, '127.0.0.1', () => {
        this.logger.log('🔄 Renewing Tor circuit to get fresh IP...');
        socket.write('AUTHENTICATE ""\r\n');
        socket.write('SIGNAL NEWNYM\r\n');
        socket.write('QUIT\r\n');
      });

      socket.on('data', (data) => {
        this.logger.debug(`Tor ControlPort response: ${data.toString()}`);
      });

      socket.on('close', () => {
        this.logger.log('✅ Tor circuit renewed');
        resolve();
      });

      socket.on('error', (err) => {
        this.logger.warn(`⚠️ Could not renew Tor circuit: ${err.message}`);
        // Ne pas bloquer si la rotation échoue
        resolve();
      });

      // Timeout de 5 secondes
      setTimeout(() => {
        socket.destroy();
        resolve();
      }, 5000);
    });
  }

  async scrape(url: string): Promise<ScrapedJobDataDto> {
    let browser;
    try {
      this.logger.log(`🔍 Scraping Indeed job from: ${url}`);

      // Détecter si on est en production (Tor est disponible)
      const isProduction = process.env.NODE_ENV === 'production';

      // 🔄 Renouveler le circuit Tor pour obtenir une nouvelle IP (éviter blacklist)
      if (isProduction) {
        await this.renewTorCircuit();
        // Attendre un peu que le nouveau circuit soit établi
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Lancer Puppeteer avec des options anti-détection AMÉLIORÉES
      const launchOptions: any = {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-dev-shm-usage',
          '--window-size=1920,1080',
          // Nouveaux flags pour paraître plus humain
          '--disable-features=IsolateOrigins',
          '--disable-site-isolation-trials',
          '--disable-features=BlockInsecurePrivateNetworkRequests',
          '--lang=fr-FR',
        ],
      };

      // En production, utiliser Tor pour masquer l'IP AWS
      if (isProduction) {
        this.logger.log('🧅 Using Tor proxy with improved anti-detection...');
        launchOptions.args.push('--proxy-server=socks5://127.0.0.1:9050');
      }

      browser = await puppeteer.launch(launchOptions);

      const page = await browser.newPage();

      // Masquer le fait qu'on utilise automation (webdriver, navigator.plugins, etc.)
      await page.evaluateOnNewDocument(() => {
        // Masquer webdriver
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
        });

        // Ajouter Chrome comme vendor
        Object.defineProperty(navigator, 'vendor', {
          get: () => 'Google Inc.',
        });

        // Ajouter des plugins pour paraître réel
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5],
        });

        // Ajouter des langues
        Object.defineProperty(navigator, 'languages', {
          get: () => ['fr-FR', 'fr', 'en-US', 'en'],
        });
      });

      // Configurer la page pour ressembler à un vrai navigateur
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      );
      await page.setViewport({ width: 1920, height: 1080 });

      // Ajouter des headers réalistes pour éviter la détection
      await page.setExtraHTTPHeaders({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
      });

      // ⚠️ NE PAS bloquer les images/CSS - Cloudflare détecte ce comportement de bot
      // Laisser charger toutes les ressources pour paraître plus humain

      // 🎭 STRATÉGIE EN 2 ÉTAPES : Visiter d'abord la homepage pour paraître humain
      this.logger.log('🏠 Step 1: Visiting Indeed homepage to establish session...');
      await page.goto('https://fr.indeed.com/', {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      // Simuler un comportement humain sur la homepage
      await new Promise(resolve => setTimeout(resolve, 2000));
      await page.mouse.move(300, 400);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Scroll un peu pour paraître humain
      await page.evaluate(() => window.scrollBy(0, 200));
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Maintenant aller sur l'offre d'emploi
      this.logger.log('🎯 Step 2: Navigating to job offer...');
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });

      // Attendre que le contenu principal soit chargé
      await page.waitForSelector('body', { timeout: 10000 });

      // 🔥 Nouvelle stratégie : attendre que le contenu Indeed soit visible
      // Au lieu de vérifier "Just a moment...", on attend les vrais sélecteurs Indeed
      this.logger.log('⏳ Waiting for Indeed job content to load...');

      try {
        // Attendre qu'au moins un des sélecteurs principaux d'Indeed soit présent
        await Promise.race([
          page.waitForSelector('h1.jobsearch-JobInfoHeader-title', { timeout: 30000 }),
          page.waitForSelector('.jobTitle', { timeout: 30000 }),
          page.waitForSelector('h1[data-testid="jobTitle"]', { timeout: 30000 }),
        ]);
        this.logger.log('✅ Indeed job content loaded successfully');
      } catch (error) {
        // Si timeout, vérifier si c'est Cloudflare
        try {
          const title = await page.title();
          if (title.includes('Just a moment') || title.includes('Please wait')) {
            this.logger.warn('⚠️ Cloudflare challenge detected but not resolved after 30s');
          } else {
            this.logger.warn(`⚠️ Could not find job content. Page title: ${title}`);
          }
        } catch (e) {
          this.logger.warn('⚠️ Could not verify page state');
        }
      }

      // Simuler un comportement humain : mouvements de souris aléatoires
      await page.mouse.move(100, 200);
      await new Promise(resolve => setTimeout(resolve, 300));
      await page.mouse.move(500, 400);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Petit délai supplémentaire pour éviter d'être détecté comme bot
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 🐛 DEBUG: Prendre un screenshot pour voir ce que Chrome voit
      const screenshotPath = '/tmp/indeed-scraping-debug.png';
      await page.screenshot({ path: screenshotPath, fullPage: false });
      this.logger.debug(`📸 Screenshot saved to: ${screenshotPath}`);

      // 🐛 DEBUG: Afficher le titre de la page
      const pageTitle = await page.title();
      this.logger.debug(`📄 Page title: ${pageTitle}`);

      // 🐛 DEBUG: Vérifier si on a un captcha ou une page de blocage
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (bodyText.includes('captcha') || bodyText.includes('robot') || bodyText.includes('access denied')) {
        this.logger.warn(`⚠️ Possible bot detection! Page contains: ${bodyText.substring(0, 200)}`);
      }

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

      // 🐛 DEBUG: Afficher les données extraites
      this.logger.debug(`📊 Extracted data:`);
      this.logger.debug(`  - Title: "${jobData.title}"`);
      this.logger.debug(`  - Company: "${jobData.companyName}"`);
      this.logger.debug(`  - Location: "${jobData.location}"`);
      this.logger.debug(`  - Description length: ${jobData.description?.length || 0} chars`);
      this.logger.debug(`  - Salary: "${jobData.salaryText}"`);
      this.logger.debug(`  - Contract: "${jobData.contractType}"`);

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
