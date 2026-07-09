import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LLM_PROVIDER } from './llm-provider.interface';
import { AnthropicLlmProvider } from './providers/anthropic.provider';
import { OpenAiLlmProvider } from './providers/openai.provider';
import { RootConfig } from '../../config/env.validation';

@Module({
  providers: [
    {
      provide: LLM_PROVIDER,
      useFactory: (configService: ConfigService<RootConfig, true>) => {
        const config = configService.get('app', { infer: true });
        return config.llmProvider === 'openai'
          ? new OpenAiLlmProvider(config)
          : new AnthropicLlmProvider(config);
      },
      inject: [ConfigService],
    },
  ],
  exports: [LLM_PROVIDER],
})
export class LlmModule {}
