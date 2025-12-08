export class ScrapedJobDataDto {
  // Données de base
  title?: string;
  companyName?: string;
  description?: string;

  // Données entreprise
  companySector?: string;
  companyWebsite?: string;

  // Localisation
  locationCity?: string;
  locationCountry?: string;

  // Salaire
  minSalary?: number;
  maxSalary?: number;
  salaryCurrency?: string;

  // Infos contrat
  typeOfContract?: string; // CDI, CDD, Freelance, etc.
  experienceLevel?: string; // Junior, Confirmé, Senior
  remoteMode?: string; // Full remote, Hybrid, On-site

  // Dates
  publicationDate?: Date;

  // Plateforme source
  platform?: string; // WTTJ, LinkedIn, Indeed
  sourceUrl: string;

  // Stack technique (liste de tags)
  technologies?: string[];

  // Données brutes pour debug
  rawData?: Record<string, any>;
}
