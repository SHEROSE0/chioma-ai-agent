import { LlmCompletionRequest, LlmCompletionResult } from './llm.types';

export const LLM_PROVIDER = Symbol('LLM_PROVIDER');

export interface LlmProvider {
  complete(request: LlmCompletionRequest): Promise<LlmCompletionResult>;
}
