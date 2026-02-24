import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BondModule } from "./bond/bond.module";
import { Bond } from "./bond/entities/bond.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MySQL connection via TypeORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        url: config.get<string>("DATABASE_URL"),
        autoLoadEntities: true,
        synchronize: true, // ok for testing
      }),
    }),

    // Feature module
    BondModule,
  ],
})
export class AppModule {}
