import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS — add Vercel URL after frontend deploy
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://bond-backend-ea7e.onrender.com',
      // 'https://your-app.vercel.app',  ← uncomment after Vercel deploy
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // All routes prefixed with /api
  app.setGlobalPrefix('api');

  // ✅ Render assigns PORT dynamically — must listen on 0.0.0.0
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

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