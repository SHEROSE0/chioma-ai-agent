import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { RootConfig } from './config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<RootConfig, true>);
  const port = configService.get('app', { infer: true }).port;

  app.enableCors();
  await app.listen(port);
   
  console.log(`chioma-agent listening on port ${port}`);
}

bootstrap();
