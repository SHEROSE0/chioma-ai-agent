import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { RootConfig } from '../../config/env.validation';

export interface PropertyRecommendation {
  propertyId: string;
  score: number;
  reasons: string[];
}

export interface MatchScore {
  propertyId: string;
  score: number;
  reasons: string[];
}

export interface PricingSuggestion {
  available: boolean;
  suggestedRent?: { min: number; max: number };
  suggestedDeposit?: { min: number; max: number };
  reasoning?: string;
}

export interface DescriptionSuggestion {
  available: boolean;
  propertyDescription?: string;
  neighborhoodDescription?: string;
}

export interface CompletenessScore {
  available: boolean;
  score?: number;
  improvements?: string[];
}

/**
 * Typed client for the chioma backend REST API. All calls require the
 * caller's own JWT bearer token — this service has no user identity of its own.
 */
@Injectable()
export class ChiomaApiClient {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService<RootConfig, true>,
  ) {
    this.baseUrl = configService.get('app', { infer: true }).chiomaApiUrl;
  }

  getRecommendations(
    accessToken: string,
    limit = 10,
  ): Promise<PropertyRecommendation[]> {
    return this.get('/api/ai/matching/recommendations', accessToken, { limit });
  }

  getMatchScore(accessToken: string, propertyId: string): Promise<MatchScore> {
    return this.get(`/api/ai/matching/match-score/${propertyId}`, accessToken);
  }

  getSimilarProperties(
    accessToken: string,
    propertyId: string,
    limit = 5,
  ): Promise<PropertyRecommendation[]> {
    return this.get(`/api/ai/matching/similar/${propertyId}`, accessToken, { limit });
  }

  getPricingSuggestion(
    accessToken: string,
    draftId: string,
  ): Promise<PricingSuggestion> {
    return this.get(
      `/property-listings/wizard/${draftId}/ai/pricing-suggestion`,
      accessToken,
    );
  }

  getDescriptionSuggestion(
    accessToken: string,
    draftId: string,
  ): Promise<DescriptionSuggestion> {
    return this.get(
      `/property-listings/wizard/${draftId}/ai/description-suggestion`,
      accessToken,
    );
  }

  getCompletenessScore(
    accessToken: string,
    draftId: string,
  ): Promise<CompletenessScore> {
    return this.get(
      `/property-listings/wizard/${draftId}/ai/completeness-score`,
      accessToken,
    );
  }

  private async get<T>(
    path: string,
    accessToken: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      baseURL: this.baseUrl,
      headers: { Authorization: `Bearer ${accessToken}` },
      params,
    };
    const response = await firstValueFrom(this.httpService.get<T>(path, config));
    return response.data;
  }
}
