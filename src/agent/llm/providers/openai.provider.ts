import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { LlmProvider } from '../llm-provider.interface';
import {
  LlmCompletionRequest,
  LlmCompletionResult,
  LlmMessage,
  LlmToolCall,
} from '../llm.types';
import { AppConfig } from '../../../config/env.validation';

@Injectable()
export class OpenAiLlmProvider implements LlmProvider {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(config: AppConfig) {
    this.client = new OpenAI({ apiKey: config.openaiApiKey });
    this.model = config.llmModel;
  }

  async complete(request: LlmCompletionRequest): Promise<LlmCompletionResult> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: request.maxTokens ?? 4096,
      messages: toOpenAiMessages(request.messages),
      tools: request.tools?.map((tool) => ({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
        },
      })),
    });

    return toLlmCompletionResult(response);
  }
}

function toOpenAiMessages(messages: LlmMessage[]): ChatCompletionMessageParam[] {
  return messages.map((message): ChatCompletionMessageParam => {
    if (message.role === 'tool') {
      return {
        role: 'tool',
        tool_call_id: message.toolCallId!,
        content: message.content,
      };
    }
    if (message.role === 'assistant') {
      return {
        role: 'assistant',
        content: message.content || null,
        tool_calls: message.toolCalls?.map((call) => ({
          id: call.id,
          type: 'function',
          function: { name: call.name, arguments: JSON.stringify(call.arguments) },
        })),
      };
    }
    if (message.role === 'system') {
      return { role: 'system', content: message.content };
    }
    return { role: 'user', content: message.content };
  });
}

function toLlmCompletionResult(
  response: OpenAI.Chat.Completions.ChatCompletion,
): LlmCompletionResult {
  const choice = response.choices[0];
  const toolCalls: LlmToolCall[] =
    choice.message.tool_calls
      ?.filter((call) => call.type === 'function')
      .map((call) => ({
        id: call.id,
        name: call.function.name,
        arguments: JSON.parse(call.function.arguments) as Record<string, unknown>,
      })) ?? [];

  return {
    message: {
      role: 'assistant',
      content: choice.message.content ?? '',
      toolCalls: toolCalls.length ? toolCalls : undefined,
    },
    stopReason:
      choice.finish_reason === 'tool_calls'
        ? 'tool_calls'
        : choice.finish_reason === 'length'
          ? 'length'
          : 'stop',
  };
}
