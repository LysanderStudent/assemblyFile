import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/');
  app.enableCors({
    origin: '*',
    allowedHeaders: [
      'Origin', 
      'X-Requested-With', 
      'Content-Type', 
      'Accept',
      'Authorization'
    ],
    methods: ['POST', 'PUT', 'DELETE', 'GET']
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(process.env.PORT || 3001);

  const logger = new Logger();
  logger.log(`Application started on port ${await app.getUrl()}`);
}
bootstrap();
