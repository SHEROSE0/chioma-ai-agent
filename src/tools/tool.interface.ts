import { LlmToolDefinition } from '../agent/llm/llm.types';

export interface ToolContext {
  /** The end user's chioma backend JWT — tools act with the caller's own permissions. */
  accessToken: string;
}

export interface AgentTool {
  definition: LlmToolDefinition;
  execute(args: Record<string, unknown>, context: ToolContext): Promise<string>;
}
