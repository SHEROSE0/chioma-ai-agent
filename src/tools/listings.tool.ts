import { Injectable } from '@nestjs/common';
import { AgentTool, ToolContext } from './tool.interface';
import { ChiomaApiClient } from '../integrations/chioma-api/chioma-api.client';

@Injectable()
export class GetRecommendationsTool implements AgentTool {
  definition = {
    name: 'get_property_recommendations',
    description:
      'Get personalized property listing recommendations for the current user, ranked by match score.',
    parameters: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of recommendations to return.',
          default: 10,
        },
      },
    },
  };

  constructor(private readonly chiomaApi: ChiomaApiClient) {}

  async execute(args: Record<string, unknown>, context: ToolContext): Promise<string> {
    const recommendations = await this.chiomaApi.getRecommendations(
      context.accessToken,
      (args.limit as number) ?? 10,
    );
    return JSON.stringify(recommendations);
  }
}

@Injectable()
export class GetMatchScoreTool implements AgentTool {
  definition = {
    name: 'get_property_match_score',
    description:
      "Get the current user's match score and reasons for a specific property listing.",
    parameters: {
      type: 'object',
      properties: {
        propertyId: { type: 'string', description: 'The property listing ID.' },
      },
      required: ['propertyId'],
    },
  };

  constructor(private readonly chiomaApi: ChiomaApiClient) {}

  async execute(args: Record<string, unknown>, context: ToolContext): Promise<string> {
    const score = await this.chiomaApi.getMatchScore(
      context.accessToken,
      args.propertyId as string,
    );
    return JSON.stringify(score);
  }
}

@Injectable()
export class GetSimilarPropertiesTool implements AgentTool {
  definition = {
    name: 'get_similar_properties',
    description: 'Get properties similar to a given property listing.',
    parameters: {
      type: 'object',
      properties: {
        propertyId: { type: 'string', description: 'The property listing ID.' },
        limit: {
          type: 'number',
          description: 'Maximum number of similar properties to return.',
          default: 5,
        },
      },
      required: ['propertyId'],
    },
  };

  constructor(private readonly chiomaApi: ChiomaApiClient) {}

  async execute(args: Record<string, unknown>, context: ToolContext): Promise<string> {
    const similar = await this.chiomaApi.getSimilarProperties(
      context.accessToken,
      args.propertyId as string,
      (args.limit as number) ?? 5,
    );
    return JSON.stringify(similar);
  }
}
