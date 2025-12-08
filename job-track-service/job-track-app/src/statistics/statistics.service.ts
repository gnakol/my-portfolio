import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidacy } from '../candidacy/entities/candidacy.entity';
import { JobOffer } from '../job-offer/entities/job-offer.entity';
import { Company } from '../company/entities/company.entity';
import {
  StatisticsOverviewDto,
  StatisticsByStackDto,
  StackPerformanceDto,
  StatisticsByLocationDto,
  LocationPerformanceDto,
} from './dto';

@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  constructor(
    @InjectRepository(Candidacy)
    private candidacyRepository: Repository<Candidacy>,
    @InjectRepository(JobOffer)
    private jobOfferRepository: Repository<JobOffer>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  /**
   * Vue d'ensemble des statistiques
   * Note: userId filtering removed as entities don't have userId column yet
   */
  async getOverview(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<StatisticsOverviewDto> {
    const start = startDate || new Date(new Date().setMonth(new Date().getMonth() - 6));
    const end = endDate || new Date();

    // Récupérer toutes les candidatures dans la période
    // TODO: Add userId filter when column is added to entities
    const candidacies = await this.candidacyRepository.find({
      relations: ['jobOffer', 'company'],
      order: { applicationDate: 'DESC' },
    });

    const totalApplications = candidacies.length;
    const totalOffers = await this.jobOfferRepository.count();
    const totalCompanies = await this.companyRepository.count();

    // Calcul des taux basés sur currentStatus
    const candidaciesWithResponse = candidacies.filter(
      (c) => c.currentStatus !== 'PENDING' && c.currentStatus !== 'SENT',
    ).length;
    const responseRate = totalApplications > 0
      ? (candidaciesWithResponse / totalApplications) * 100
      : 0;

    // Pour le taux d'entretien, on compte les statuts qui incluent "INTERVIEW"
    const candidaciesWithInterview = candidacies.filter(
      (c) => c.currentStatus?.toUpperCase().includes('INTERVIEW'),
    ).length;
    const interviewRate = totalApplications > 0
      ? (candidaciesWithInterview / totalApplications) * 100
      : 0;

    const candidaciesWithOffer = candidacies.filter(
      (c) => c.currentStatus === 'OFFER_RECEIVED' || c.currentStatus === 'ACCEPTED',
    ).length;
    const offerReceivedRate = totalApplications > 0
      ? (candidaciesWithOffer / totalApplications) * 100
      : 0;

    // Temps moyen de réponse (Note: responseDate n'existe pas encore, on met 0)
    // TODO: Add responseDate column to candidacy entity
    const averageResponseTimeInDays = 0;

    // Candidatures par semaine
    const weeksDiff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7),
    );
    const applicationsPerWeek = weeksDiff > 0 ? totalApplications / weeksDiff : 0;

    // Répartition par statut
    const statusCounts = candidacies.reduce((acc, c) => {
      const status = c.currentStatus || 'UNKNOWN';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: (count / totalApplications) * 100,
    }));

    return {
      startDate: start,
      endDate: end,
      totalApplications,
      totalOffers,
      totalCompanies,
      responseRate: Math.round(responseRate * 100) / 100,
      interviewRate: Math.round(interviewRate * 100) / 100,
      offerReceivedRate: Math.round(offerReceivedRate * 100) / 100,
      averageResponseTimeInDays: Math.round(averageResponseTimeInDays * 100) / 100,
      applicationsPerWeek: Math.round(applicationsPerWeek * 100) / 100,
      statusBreakdown,
    };
  }

  /**
   * Performance par stack
   * Note: stackTags relation doesn't exist yet in JobOffer entity
   */
  async getByStack(userId: string): Promise<StackPerformanceDto> {
    // TODO: Implement when stackTags relation is added to JobOffer entity
    this.logger.warn('Stack statistics not yet implemented - awaiting stackTags relation');

    return {
      stacks: [],
      totalStacks: 0,
    };
  }

  /**
   * Performance par localisation
   */
  async getByLocation(userId: string): Promise<LocationPerformanceDto> {
    const candidacies = await this.candidacyRepository.find({
      relations: ['jobOffer'],
    });

    // Grouper par localisation (locationCity)
    const locationMap = new Map<string, Candidacy[]>();

    candidacies.forEach((candidacy) => {
      const location = candidacy.jobOffer?.locationCity || 'Non spécifié';
      if (!locationMap.has(location)) {
        locationMap.set(location, []);
      }
      locationMap.get(location)!.push(candidacy);
    });

    // Calculer les stats par localisation
    const locations: StatisticsByLocationDto[] = Array.from(locationMap.entries()).map(
      ([location, candidacies]) => {
        const totalApplications = candidacies.length;
        const totalResponses = candidacies.filter(
          (c) => c.currentStatus !== 'PENDING' && c.currentStatus !== 'SENT',
        ).length;
        const totalInterviews = candidacies.filter((c) =>
          c.currentStatus?.toUpperCase().includes('INTERVIEW'),
        ).length;
        const totalOffersReceived = candidacies.filter(
          (c) => c.currentStatus === 'OFFER_RECEIVED' || c.currentStatus === 'ACCEPTED',
        ).length;

        return {
          location,
          totalApplications,
          totalResponses,
          totalInterviews,
          totalOffersReceived,
          responseRate:
            totalApplications > 0
              ? Math.round(((totalResponses / totalApplications) * 100) * 100) / 100
              : 0,
          interviewRate:
            totalApplications > 0
              ? Math.round(((totalInterviews / totalApplications) * 100) * 100) / 100
              : 0,
          successRate:
            totalApplications > 0
              ? Math.round(((totalOffersReceived / totalApplications) * 100) * 100) / 100
              : 0,
        };
      },
    );

    // Trier par nombre de candidatures décroissant
    locations.sort((a, b) => b.totalApplications - a.totalApplications);

    return {
      locations,
      totalLocations: locations.length,
    };
  }
}
