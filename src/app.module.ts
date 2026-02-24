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
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
port: config.get<number>('DB_PORT'),
username: config.get<string>('DB_USERNAME'),
password: config.get<string>('DB_PASSWORD'),
database: config.get<string>('DB_DATABASE'),
        entities: [Bond],
        synchronize: true,  
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),

    // Feature module
    BondModule,
  ],
})
export class AppModule {}
