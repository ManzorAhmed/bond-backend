import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — allow React frontend (Vite dev server)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });

  // Global validation pipe — validates all DTOs automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // strip unknown fields
      forbidNonWhitelisted: true, // throw error on unknown fields
      transform: true,           // auto-transform types (string → number)
    }),
  );

  // Prefix all routes with /api
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`\n🚀 Bond API running at: http://localhost:${port}/api`);
  console.log(`📋 Endpoints:`);
  console.log(`   POST   /api/bond        → Calculate + save`);
  console.log(`   GET    /api/bond        → List all history`);
  console.log(`   GET    /api/bond/:id    → Get single record`);
  console.log(`   PATCH  /api/bond/:id    → Update + recalculate`);
  console.log(`   DELETE /api/bond/:id    → Delete one`);
  console.log(`   DELETE /api/bond        → Clear all\n`);
}
bootstrap();
