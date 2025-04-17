import { Module } from '@nestjs/common';
import { SubjectPrerequisiteService } from './domain/port/input/subject-prerequisite.service';
import { SubjectPrerequisiteController } from './adapters/driver/subject-prerequisite.controller';
import { SubjectPrerequisiteRepository } from './adapters/driven/subject-prerequisite.repository';
import { SUBJECT_PREREQUISITE_REPOSITORY } from './domain/port/output/ISubjectPrerequisiteRepository';

@Module({
  exports: [SubjectPrerequisiteService],
  controllers: [SubjectPrerequisiteController],
  providers: [
    SubjectPrerequisiteService,
    {
      provide: SUBJECT_PREREQUISITE_REPOSITORY,
      useClass: SubjectPrerequisiteRepository,
    },
  ],
})
export class SubjectPrerequisitesModule {}
