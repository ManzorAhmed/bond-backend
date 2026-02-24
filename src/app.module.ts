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

    // MySQL connection via TypeORM
   TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        url: config.get<string>("DATABASE_URL"),

        autoLoadEntities: true,
        synchronize: false,

        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),


    // Feature module
    BondModule,
  ],
})
export class AppModule {}
