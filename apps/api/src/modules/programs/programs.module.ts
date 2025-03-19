import { Module } from '@nestjs/common';
import { ProgramsService } from './domain/port/input/programs.service';
import { ProgramsController } from './adapters/driver/programs.controller';
import { ProgramsRepository } from './adapters/driven/programs.repository';

@Module({
  exports: [ProgramsService],
  controllers: [ProgramsController],
  providers: [
    ProgramsService,
    {
      provide: 'IProgramsRepository',
      useClass: ProgramsRepository,
    },
  ],
})
export class ProgramsModule {}
