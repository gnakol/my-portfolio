import { Injectable, Logger } from '@nestjs/common';
import { ScrapedJobDataDto } from '../dto';
import * as puppeteer from 'puppeteer';

@Injectable()
export class WttjScraper {
  private readonly logger = new Logger(WttjScraper.name);

  async scrape(url: string): Promise<ScrapedJobDataDto> {
    let browser: puppeteer.Browser | null = null;

    try {
      this.logger.log(`Scraping WTTJ job from: ${url}`);

      // Launch Puppeteer browser
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();

      // Set user agent
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Navigate to the page
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
      await page.waitForSelector('h1', { timeout: 20000 }).catch(() => {});

      // Wait for the page to load completely
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Take a screenshot for debugging
      const screenshotPath = '/tmp/wttj-scraping-debug.png';
      await page.screenshot({ path: screenshotPath, fullPage: true });
      this.logger.log(`Screenshot saved to: ${screenshotPath}`);

      // Log the page title to verify we're on the right page
      const pageTitle = await page.title();
      this.logger.log(`Page title: ${pageTitle}`);

      // Extract data from the page - First try JSON-LD structured data
      const data: {
        title: string | null;
        companyName: string | null;
        location: string | null;
        description: string | null;
        contractType: string | undefined;
        remoteMode: string | undefined;
        salaryText: string;
        technologies: string[];
        minSalary?: number;
        maxSalary?: number;
        companySector?: string;
        companyWebsite?: string;
      } = await page.evaluate(() => {
        // Try to extract JSON-LD structured data first (most reliable)
        const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
        let jobPostingData: any = null;

        jsonLdScripts.forEach(script => {
          try {
            const data = JSON.parse(script.textContent || '');
            if (data['@type'] === 'JobPosting') {
              jobPostingData = data;
            }
          } catch (e) {
            // Ignore parsing errors
          }
        });

        let title: string | null = null;
        let companyName: string | null = null;
        let location: string | null = null;
        let description: string | null = null;
        let contractType: string | undefined = undefined;
        let remoteMode: string | undefined = undefined;
        let minSalary: number | undefined = undefined;
        let maxSalary: number | undefined = undefined;
        let companySector: string | undefined = undefined;
        let companyWebsite: string | undefined = undefined;

        // Extract from JSON-LD if available
        if (jobPostingData) {
          title = jobPostingData.title || null;
          companyName = jobPostingData.hiringOrganization?.name || null;

          // Extract location from jobLocation
          if (jobPostingData.jobLocation && jobPostingData.jobLocation.length > 0) {
            const jobLocation = jobPostingData.jobLocation[0];
            location = jobLocation.address?.addressLocality || null;
          }

          description = jobPostingData.description || null;

          // Extract contract type
          if (jobPostingData.employmentType) {
            const empType = jobPostingData.employmentType;
            if (empType === 'FULL_TIME') contractType = 'CDI';
            else if (empType === 'PART_TIME') contractType = 'CDD';
            else contractType = empType;
          }

          // Extract salary from structured data
          if (jobPostingData.baseSalary?.value) {
            minSalary = jobPostingData.baseSalary.value.minValue;
            maxSalary = jobPostingData.baseSalary.value.maxValue;
          }
        }

        // Fallback to DOM parsing if JSON-LD didn't provide everything
        const getText = (selector: string): string | null => {
          const element = document.querySelector(selector);
          return element ? element.textContent?.trim() || null : null;
        };

        // Title fallback
        if (!title) {
          title = getText('h1');
          if (!title) {
            const h1Elements = Array.from(document.querySelectorAll('h1'));
            const jobH1 = h1Elements.find(h1 => {
              const text = h1.textContent?.trim() || '';
              return text.length > 10 && text.length < 200;
            });
            title = jobH1?.textContent?.trim() || null;
          }
        }

        // Company name fallback
        if (!companyName) {
          companyName = getText('a[href*="/companies/"]');
          if (!companyName) {
            const urlMatch = window.location.href.match(/\/companies\/([^\/]+)/);
            if (urlMatch && urlMatch[1]) {
              companyName = urlMatch[1].toUpperCase();
            }
          }
        }

        // Location fallback
        if (!location) {
          const locationKeywords = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Bordeaux', 'Remote', 'France'];
          const allElements = Array.from(document.querySelectorAll('span, div, p'));
          const locationElement = allElements.find(el => {
            const text = el.textContent?.trim() || '';
            return locationKeywords.some(keyword => text.includes(keyword)) && text.length < 100;
          });
          location = locationElement?.textContent?.trim() || null;
        }

        // Description fallback
        if (!description) {
          const descriptionElement = document.querySelector('[data-testid="job-section-description"]') ||
                                    document.querySelector('article') ||
                                    document.querySelector('[class*="description"]');
          description = descriptionElement?.innerHTML || null;
        }

        // Remote mode detection
        const remoteKeywords = ['remote', 'Remote', 'Télétravail', 'télétravail', 'Occasional remote', 'Fully-remote'];
        const pageText = document.body.textContent || '';
        for (const keyword of remoteKeywords) {
          if (pageText.includes(keyword)) {
            remoteMode = keyword;
            break;
          }
        }

        // Extract technologies/skills
        const technologies: string[] = [];
        document.querySelectorAll('[data-testid="tag"], [class*="tag"], [class*="skill"], [class*="technology"]')
          .forEach(el => {
            const tech = el.textContent?.trim();
            if (tech && tech.length > 0 && tech.length < 50) {
              technologies.push(tech);
            }
          });

        // Extract company sector (e.g. "Software, Lotteries / Gambling, SaaS / Cloud Service...")
        // Stratégie 1: Chercher dans la sidebar "The company"
        const companySidebarElements = Array.from(document.querySelectorAll('div, span, p'));
        const sectorKeywords = ['Software', 'Finance', 'Healthcare', 'E-commerce', 'SaaS', 'Gaming', 'Lotteries', 'Cloud', 'Marketing', 'Education', 'Tech', 'BtoB', 'B2B', 'iGaming', 'AI', 'Data'];

        for (const el of companySidebarElements) {
          const text = el.textContent?.trim() || '';

          // Ignorer les textes de cookies, privacy policy, etc.
          if (text.toLowerCase().includes('cookie') ||
              text.toLowerCase().includes('privacy') ||
              text.toLowerCase().includes('personal data') ||
              text.length > 300) {
            continue;
          }

          // Chercher un texte avec des mots-clés de secteur et des séparateurs (/ ou ,)
          const hasSectorKeyword = sectorKeywords.some(keyword => text.includes(keyword));
          const hasSeparators = text.includes('/') || text.includes(',');
          const hasMultipleParts = text.split(/[,\/]/).length >= 2;

          if (hasSectorKeyword && hasSeparators && hasMultipleParts && text.length > 10 && text.length < 200) {
            companySector = text;
            break;
          }
        }

        // Stratégie 2: Si pas trouvé, analyser la description "Who are they?"
        if (!companySector) {
          const whoAreTheyText = document.body.textContent || '';
          const patterns = [
            /(?:éditeur de |editor of |company specializing in )([^.]+)/i,
            /(?:évoluant dans l'univers de |operating in the field of )([^.]+)/i,
            /(?:dans le secteur |in the sector of |in the field of )([^.]+)/i
          ];

          for (const pattern of patterns) {
            const match = whoAreTheyText.match(pattern);
            if (match && match[1] && match[1].length < 100) {
              companySector = match[1].trim();
              break;
            }
          }
        }

        // Extract company website - look for "View website" link
        const websiteLinkElement = Array.from(document.querySelectorAll('a')).find(a => {
          const text = a.textContent?.trim() || '';
          return text.toLowerCase().includes('view website') || text.toLowerCase().includes('website') || text.toLowerCase().includes('site web');
        });

        if (websiteLinkElement) {
          const href = websiteLinkElement.getAttribute('href');
          if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
            companyWebsite = href;
          }
        }

        // Salary text for logging
        let salaryText = '';
        if (minSalary && maxSalary) {
          salaryText = `€${minSalary / 1000}K to ${maxSalary / 1000}K`;
        }

        return {
          title,
          companyName,
          location,
          description,
          contractType,
          remoteMode,
          salaryText,
          technologies,
          minSalary,
          maxSalary,
          companySector,
          companyWebsite,
        };
      });

      this.logger.log(`Extracted data: ${JSON.stringify({
        title: data.title,
        company: data.companyName,
        location: data.location,
        salary: `${data.minSalary || 'N/A'} - ${data.maxSalary || 'N/A'}`
      })}`);

      // Parse location (city and country)
      let locationCity: string | undefined;
      let locationCountry: string | undefined;

      if (data.location) {
        const locationParts = data.location.split(',').map(s => s.trim());
        if (locationParts.length > 0) {
          locationCity = locationParts[0];
        }
        if (locationParts.length > 1) {
          locationCountry = locationParts[locationParts.length - 1];
        }
      }

      // Déduire le pays à partir de la ville si non trouvé
      if (locationCity && !locationCountry) {
        locationCountry = this.deduceCountryFromCity(locationCity);
      }

      // Use salary from JSON-LD if available, otherwise try parsing salaryText
      let minSalary: number | undefined = data.minSalary;
      let maxSalary: number | undefined = data.maxSalary;

      if (!minSalary && !maxSalary && data.salaryText) {
        this.logger.log(`Salary text found: ${data.salaryText}`);

        // Try multiple patterns
        // Pattern 1: "€47K to 62K", "47k to 62k", "47K - 62K"
        let salaryMatch = data.salaryText.match(/€?\s*(\d+)\s*k\s*(?:to|-|–)\s*(\d+)\s*k/i);

        // Pattern 2: "47000€ - 62000€"
        if (!salaryMatch) {
          salaryMatch = data.salaryText.match(/(\d+)000\s*€?\s*(?:to|-|–)\s*(\d+)000/i);
        }

        // Pattern 3: Just numbers with k
        if (!salaryMatch) {
          salaryMatch = data.salaryText.match(/(\d+)\s*k.*?(\d+)\s*k/i);
        }

        if (salaryMatch) {
          minSalary = parseInt(salaryMatch[1]) * 1000; // Convert to annual
          maxSalary = parseInt(salaryMatch[2]) * 1000;
          this.logger.log(`Parsed salary: ${minSalary / 1000}k - ${maxSalary / 1000}k`);
        } else {
          this.logger.warn(`Could not parse salary from: ${data.salaryText}`);
        }
      } else if (minSalary && maxSalary) {
        this.logger.log(`Using salary from JSON-LD: ${minSalary} - ${maxSalary}`);
      }

      await browser.close();

      return {
        title: data.title || undefined,
        companyName: data.companyName || undefined,
        description: data.description || undefined,
        companySector: data.companySector || undefined,
        companyWebsite: data.companyWebsite || undefined,
        locationCity: locationCity || undefined,
        locationCountry: locationCountry || undefined,
        minSalary,
        maxSalary,
        typeOfContract: data.contractType || undefined,
        remoteMode: data.remoteMode || undefined,
        platform: 'WTTJ',
        sourceUrl: url,
        technologies: data.technologies.length > 0 ? data.technologies : undefined,
        rawData: {
          scrapedAt: new Date().toISOString(),
          salaryText: data.salaryText,
        },
      };
    } catch (error) {
      if (browser) {
        await browser.close();
      }
      this.logger.error(`Error scraping WTTJ job: ${error.message}`);
      throw new Error(`Failed to scrape WTTJ job: ${error.message}`);
    }
  }

  canHandle(url: string): boolean {
    return url.includes('welcometothejungle.com');
  }

  /**
   * Déduit le pays à partir du nom de la ville
   * Mapping des principales villes françaises
   */
  private deduceCountryFromCity(city: string): string | undefined {
    const cityLower = city.toLowerCase().trim();

    // Mapping des villes françaises les plus courantes
    const frenchCities = [
      'paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'montpellier',
      'strasbourg', 'bordeaux', 'lille', 'rennes', 'reims', 'saint-étienne',
      'toulon', 'grenoble', 'dijon', 'angers', 'nîmes', 'villeurbanne',
      'saint-denis', 'le mans', 'aix-en-provence', 'clermont-ferrand', 'brest',
      'tours', 'amiens', 'limoges', 'annecy', 'perpignan', 'boulogne-billancourt',
      'metz', 'besançon', 'orléans', 'rouen', 'argenteuil', 'mulhouse',
      'caen', 'nancy', 'saint-paul', 'roubaix', 'tourcoing', 'nanterre',
      'avignon', 'vitry-sur-seine', 'créteil', 'dunkerque', 'poitiers',
      'asnières-sur-seine', 'courbevoie', 'versailles', 'colombes', 'fort-de-france',
      'aulnay-sous-bois', 'saint-pierre', 'rueil-malmaison', 'pau', 'aubervilliers',
      'le havre', 'cannes', 'antibes', 'la rochelle', 'calais', 'champigny-sur-marne'
    ];

    if (frenchCities.includes(cityLower)) {
      return 'France';
    }

    // Villes belges
    const belgianCities = ['bruxelles', 'brussels', 'anvers', 'antwerp', 'gand', 'ghent', 'charleroi', 'liège', 'bruges'];
    if (belgianCities.includes(cityLower)) {
      return 'Belgique';
    }

    // Villes suisses
    const swissCities = ['genève', 'geneva', 'zurich', 'bâle', 'basel', 'lausanne', 'berne', 'bern'];
    if (swissCities.includes(cityLower)) {
      return 'Suisse';
    }

    // Villes luxembourgeoises
    if (cityLower === 'luxembourg') {
      return 'Luxembourg';
    }

    // Villes canadiennes (Québec)
    const canadianCities = ['montréal', 'montreal', 'québec', 'quebec', 'ottawa', 'toronto', 'vancouver'];
    if (canadianCities.includes(cityLower)) {
      return 'Canada';
    }

    // Si la ville n'est pas reconnue, on ne devine pas
    return undefined;
  }
}
