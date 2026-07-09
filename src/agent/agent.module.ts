import { Module } from '@nestjs/common';
import { LlmModule } from './llm/llm.module';
import { MemoryModule } from './memory/memory.module';
import { ToolsModule } from '../tools/tools.module';
import { ConversationService } from './conversation/conversation.service';

@Module({
  imports: [LlmModule, MemoryModule, ToolsModule],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class AgentModule {}
