import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BondModule } from './bond/bond.module';
import { Bond } from './bond/entities/bond.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // ✅ Switched from mysql → postgres
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [Bond],
        synchronize: true, // auto-creates tables
        // ✅ Required for Render PostgreSQL
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),

    BondModule,
  ],
})
export class AppModule {}