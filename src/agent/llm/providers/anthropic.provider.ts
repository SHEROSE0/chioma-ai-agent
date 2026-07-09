import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { LlmProvider } from '../llm-provider.interface';
import {
  LlmCompletionRequest,
  LlmCompletionResult,
  LlmMessage,
  LlmToolCall,
} from '../llm.types';
import { AppConfig } from '../../../config/env.validation';

@Injectable()
export class AnthropicLlmProvider implements LlmProvider {
  private readonly client: Anthropic;
  private readonly model: string;

  constructor(config: AppConfig) {
    this.client = new Anthropic({ apiKey: config.anthropicApiKey });
    this.model = config.llmModel;
  }

  async complete(request: LlmCompletionRequest): Promise<LlmCompletionResult> {
    const { system, messages } = toAnthropicMessages(request.messages);

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: request.maxTokens ?? 4096,
      system,
      messages,
      tools: request.tools?.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.parameters as Anthropic.Tool.InputSchema,
      })),
    });

    return toLlmCompletionResult(response);
  }
}

function toAnthropicMessages(messages: LlmMessage[]): {
  system: string | undefined;
  messages: Anthropic.MessageParam[];
} {
  const systemParts: string[] = [];
  const result: Anthropic.MessageParam[] = [];

  for (const message of messages) {
    if (message.role === 'system') {
      systemParts.push(message.content);
      continue;
    }

    if (message.role === 'tool') {
      const toolResultBlock: Anthropic.ToolResultBlockParam = {
        type: 'tool_result',
        tool_use_id: message.toolCallId!,
        content: message.content,
      };
      const last = result[result.length - 1];
      if (last?.role === 'user' && Array.isArray(last.content)) {
        last.content.push(toolResultBlock);
      } else {
        result.push({ role: 'user', content: [toolResultBlock] });
      }
      continue;
    }

    if (message.role === 'assistant' && message.toolCalls?.length) {
      const blocks: Anthropic.ContentBlockParam[] = [];
      if (message.content) {
        blocks.push({ type: 'text', text: message.content });
      }
      for (const call of message.toolCalls) {
        blocks.push({
          type: 'tool_use',
          id: call.id,
          name: call.name,
          input: call.arguments,
        });
      }
      result.push({ role: 'assistant', content: blocks });
      continue;
    }

    result.push({ role: message.role, content: message.content });
  }

  return {
    system: systemParts.length ? systemParts.join('\n\n') : undefined,
    messages: result,
  };
}

function toLlmCompletionResult(response: Anthropic.Message): LlmCompletionResult {
  const toolCalls: LlmToolCall[] = [];
  let text = '';

  for (const block of response.content) {
    if (block.type === 'text') {
      text += block.text;
    } else if (block.type === 'tool_use') {
      toolCalls.push({
        id: block.id,
        name: block.name,
        arguments: block.input as Record<string, unknown>,
      });
    }
  }

  return {
    message: {
      role: 'assistant',
      content: text,
      toolCalls: toolCalls.length ? toolCalls : undefined,
    },
    stopReason: response.stop_reason === 'tool_use' ? 'tool_calls' : response.stop_reason === 'max_tokens' ? 'length' : 'stop',
  };
}
