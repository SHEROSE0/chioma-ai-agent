import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChiomaApiClient } from './chioma-api.client';

@Module({
  imports: [HttpModule],
  providers: [ChiomaApiClient],
  exports: [ChiomaApiClient],
})
export class ChiomaApiModule {}
