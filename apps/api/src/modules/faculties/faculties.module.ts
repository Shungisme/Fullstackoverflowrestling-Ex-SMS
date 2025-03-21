import { Module } from '@nestjs/common';
import { FacultiesService } from './domain/port/input/faculties.service';
import { FacultiesController } from './adapters/driver/faculties.controller';
import { FacultiesRepository } from './adapters/driven/faculties.repository';
import { FACULTIES_REPOSITORY } from './domain/port/output/IFacultiesRepository';

@Module({
  exports: [FacultiesService],
  controllers: [FacultiesController],
  providers: [
    FacultiesService,
    {
      provide: FACULTIES_REPOSITORY,
      useClass: FacultiesRepository,
    },
  ],
})
export class FacultiesModule {}
