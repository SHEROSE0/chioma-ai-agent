import { ToolRegistry } from './tools.registry';
import { AgentTool, ToolContext } from './tool.interface';

describe('ToolRegistry', () => {
  const context: ToolContext = { accessToken: 'tok' };

  function makeTool(name: string, execute: AgentTool['execute']): AgentTool {
    return {
      definition: { name, description: `desc for ${name}`, parameters: { type: 'object' } },
      execute,
    };
  }

  it('exposes definitions for all registered tools', () => {
    const tools = [
      makeTool('tool_a', jest.fn()),
      makeTool('tool_b', jest.fn()),
    ];
    const registry = new ToolRegistry(tools);

    expect(registry.getDefinitions().map((d) => d.name)).toEqual(['tool_a', 'tool_b']);
  });

  it('executes the named tool with args and context', async () => {
    const execute = jest.fn().mockResolvedValue('the result');
    const registry = new ToolRegistry([makeTool('tool_a', execute)]);

    const result = await registry.execute('tool_a', { foo: 'bar' }, context);

    expect(result).toBe('the result');
    expect(execute).toHaveBeenCalledWith({ foo: 'bar' }, context);
  });

  it('returns an error string for an unknown tool instead of throwing', async () => {
    const registry = new ToolRegistry([]);

    const result = await registry.execute('does_not_exist', {}, context);

    expect(result).toMatch(/unknown tool/i);
  });

  it('catches tool execution errors and returns them as a string', async () => {
    const execute = jest.fn().mockRejectedValue(new Error('boom'));
    const registry = new ToolRegistry([makeTool('tool_a', execute)]);

    const result = await registry.execute('tool_a', {}, context);

    expect(result).toMatch(/error executing tool "tool_a"/i);
    expect(result).toMatch(/boom/);
  });
});
