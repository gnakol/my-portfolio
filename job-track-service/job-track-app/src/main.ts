import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true,
  });

  // API prefix
  const apiPrefix = configService.get('API_PREFIX') || '/api';
  app.setGlobalPrefix(apiPrefix);

  const port = configService.get('PORT') || 3001;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}${apiPrefix}`);
}
bootstrap();
