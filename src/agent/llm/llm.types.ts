export type LlmRole = 'system' | 'user' | 'assistant' | 'tool';

export interface LlmToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface LlmMessage {
  role: LlmRole;
  content: string;
  /** Present on assistant messages that invoked tools. */
  toolCalls?: LlmToolCall[];
  /** Present on tool messages: which call this result answers. */
  toolCallId?: string;
  /** Present on tool messages: the tool name that produced the result. */
  name?: string;
}

export interface LlmToolDefinition {
  name: string;
  description: string;
  /** JSON Schema for the tool's input. */
  parameters: Record<string, unknown>;
}

export interface LlmCompletionRequest {
  messages: LlmMessage[];
  tools?: LlmToolDefinition[];
  maxTokens?: number;
  temperature?: number;
}

export interface LlmCompletionResult {
  message: LlmMessage;
  stopReason: 'stop' | 'tool_calls' | 'length';
}
