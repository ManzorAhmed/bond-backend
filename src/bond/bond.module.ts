import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BondService } from './bond.service';
import { BondController } from './bond.controller';
import { Bond } from './entities/bond.entity';

@Module({
  imports: [
    // Register Bond entity with TypeORM for this module
    TypeOrmModule.forFeature([Bond]),
  ],
  controllers: [BondController],
  providers: [BondService],
  exports: [BondService], // export if needed in other modules
})
export class BondModule {}
