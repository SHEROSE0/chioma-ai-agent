import { Injectable } from '@nestjs/common';
import { AgentTool, ToolContext } from './tool.interface';
import { ChiomaApiClient } from '../integrations/chioma-api/chioma-api.client';

@Injectable()
export class GetPricingSuggestionTool implements AgentTool {
  definition = {
    name: 'get_listing_pricing_suggestion',
    description:
      'Get an AI-suggested monthly rent and security deposit range for a property listing draft the user is creating.',
    parameters: {
      type: 'object',
      properties: {
        draftId: { type: 'string', description: 'The property listing wizard draft ID.' },
      },
      required: ['draftId'],
    },
  };

  constructor(private readonly chiomaApi: ChiomaApiClient) {}

  async execute(args: Record<string, unknown>, context: ToolContext): Promise<string> {
    const suggestion = await this.chiomaApi.getPricingSuggestion(
      context.accessToken,
      args.draftId as string,
    );
    return JSON.stringify(suggestion);
  }
}

@Injectable()
export class GetDescriptionSuggestionTool implements AgentTool {
  definition = {
    name: 'get_listing_description_suggestion',
    description:
      'Get an AI-generated property description and neighborhood blurb for a listing draft the user is creating.',
    parameters: {
      type: 'object',
      properties: {
        draftId: { type: 'string', description: 'The property listing wizard draft ID.' },
      },
      required: ['draftId'],
    },
  };

  constructor(private readonly chiomaApi: ChiomaApiClient) {}

  async execute(args: Record<string, unknown>, context: ToolContext): Promise<string> {
    const suggestion = await this.chiomaApi.getDescriptionSuggestion(
      context.accessToken,
      args.draftId as string,
    );
    return JSON.stringify(suggestion);
  }
}

@Injectable()
export class GetCompletenessScoreTool implements AgentTool {
  definition = {
    name: 'get_listing_completeness_score',
    description:
      'Get an AI completeness score (0-100) and suggested improvements for a property listing draft.',
    parameters: {
      type: 'object',
      properties: {
        draftId: { type: 'string', description: 'The property listing wizard draft ID.' },
      },
      required: ['draftId'],
    },
  };

  constructor(private readonly chiomaApi: ChiomaApiClient) {}

  async execute(args: Record<string, unknown>, context: ToolContext): Promise<string> {
    const score = await this.chiomaApi.getCompletenessScore(
      context.accessToken,
      args.draftId as string,
    );
    return JSON.stringify(score);
  }
}
