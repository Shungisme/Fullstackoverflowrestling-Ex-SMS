import { Module } from '@nestjs/common';
import { ProgramsService } from './domain/port/input/programs.service';
import { ProgramsController } from './adapters/driver/programs.controller';
import { ProgramsRepository } from './adapters/driven/programs.repository';
import { PROGRAM_REPOSITORY } from './domain/port/output/IProgramsRepository';

@Module({
  exports: [ProgramsService],
  controllers: [ProgramsController],
  providers: [
    ProgramsService,
    {
      provide: PROGRAM_REPOSITORY,
      useClass: ProgramsRepository,
    },
  ],
})
export class ProgramsModule {}
