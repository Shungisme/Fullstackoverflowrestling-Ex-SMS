import { Module } from '@nestjs/common';
import { FacultiesService } from './domain/port/input/faculties.service';
import { FacultiesController } from './adapters/driver/faculties.controller';
import { FacultiesRepository } from './adapters/driven/faculties.repository';

@Module({
  exports: [FacultiesService],
  controllers: [FacultiesController],
  providers: [
    FacultiesService,
    {
      provide: 'IFacultiesRepository',
      useClass: FacultiesRepository,
    },
  ],
})
export class FacultiesModule {}
