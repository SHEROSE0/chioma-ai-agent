import { Inject, Injectable } from '@nestjs/common';
import { AgentTool, ToolContext } from './tool.interface';
import { LlmToolDefinition } from '../agent/llm/llm.types';

export const AGENT_TOOLS = Symbol('AGENT_TOOLS');

@Injectable()
export class ToolRegistry {
  private readonly toolsByName = new Map<string, AgentTool>();

  constructor(@Inject(AGENT_TOOLS) tools: AgentTool[]) {
    for (const tool of tools) {
      this.toolsByName.set(tool.definition.name, tool);
    }
  }

  getDefinitions(): LlmToolDefinition[] {
    return Array.from(this.toolsByName.values(), (tool) => tool.definition);
  }

  async execute(
    name: string,
    args: Record<string, unknown>,
    context: ToolContext,
  ): Promise<string> {
    const tool = this.toolsByName.get(name);
    if (!tool) {
      return `Error: unknown tool "${name}"`;
    }
    try {
      return await tool.execute(args, context);
    } catch (error) {
      return `Error executing tool "${name}": ${(error as Error).message}`;
    }
  }
}
