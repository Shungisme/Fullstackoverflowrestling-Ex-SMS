import { Module } from '@nestjs/common';
import { SubjectsService } from './domain/port/input/subjects.service';
import { SubjectsController } from './adapters/driver/subjects.controller';
import { SubjectsRepository } from './adapters/driven/subjects.repository';
import { SUBJECTS_REPOSITORY } from './domain/port/output/ISubjectsRepository';

@Module({
  exports: [SubjectsService],
  controllers: [SubjectsController],
  providers: [
    SubjectsService,
    {
      provide: SUBJECTS_REPOSITORY,
      useClass: SubjectsRepository,
    },
  ],
})
export class SubjectsModule {}
