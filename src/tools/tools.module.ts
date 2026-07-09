import { Module } from '@nestjs/common';
import { ChiomaApiModule } from '../integrations/chioma-api/chioma-api.module';
import {
  GetMatchScoreTool,
  GetRecommendationsTool,
  GetSimilarPropertiesTool,
} from './listings.tool';
import {
  GetCompletenessScoreTool,
  GetDescriptionSuggestionTool,
  GetPricingSuggestionTool,
} from './wizard.tool';
import { AGENT_TOOLS, ToolRegistry } from './tools.registry';

const TOOL_PROVIDERS = [
  GetRecommendationsTool,
  GetMatchScoreTool,
  GetSimilarPropertiesTool,
  GetPricingSuggestionTool,
  GetDescriptionSuggestionTool,
  GetCompletenessScoreTool,
];

@Module({
  imports: [ChiomaApiModule],
  providers: [
    ...TOOL_PROVIDERS,
    {
      provide: AGENT_TOOLS,
      useFactory: (...tools: unknown[]) => tools,
      inject: TOOL_PROVIDERS,
    },
    ToolRegistry,
  ],
  exports: [ToolRegistry],
})
export class ToolsModule {}
