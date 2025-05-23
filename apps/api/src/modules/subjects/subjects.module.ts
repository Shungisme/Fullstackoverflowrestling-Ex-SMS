import { Module } from '@nestjs/common';
import { SubjectsService } from './domain/port/input/subjects.service';
import { SubjectsController } from './adapters/driver/subjects.controller';
import { SubjectsRepository } from './adapters/driven/subjects.repository';
import { SUBJECTS_REPOSITORY } from './domain/port/output/ISubjectsRepository';
import { StudentClassEnrollRepository } from '../student-class-enrolls/adapters/driven/student-class-enroll.repository';
import { ClassesRepository } from '../classes/adapters/driven/classes.repository';
import { CLASSES_REPOSITORY } from '../classes/domain/port/output/IClassesRepository';
import { STUDENT_CLASS_ENROLL_REPOSITORY } from '../student-class-enrolls/domain/port/output/IStudentClassEnrollRepository';
import { SubjectPrerequisiteRepository } from '../subject-prerequisites/adapters/driven/subject-prerequisite.repository';
import { SUBJECT_PREREQUISITE_REPOSITORY } from '../subject-prerequisites/domain/port/output/ISubjectPrerequisiteRepository';
import { TranslationsModule } from '../translations/translation.module';
import { PrismaService } from 'src/shared/services/database/prisma.service';

@Module({
  imports: [TranslationsModule], // Import TranslationsModule
  exports: [SubjectsService],
  controllers: [SubjectsController],
  providers: [
    SubjectsService,
    PrismaService,
    {
      provide: SUBJECTS_REPOSITORY,
      useClass: SubjectsRepository,
    },
    {
      provide: STUDENT_CLASS_ENROLL_REPOSITORY,
      useClass: StudentClassEnrollRepository,
    },
    {
      provide: CLASSES_REPOSITORY,
      useClass: ClassesRepository,
    },
    {
      provide: SUBJECT_PREREQUISITE_REPOSITORY,
      useClass: SubjectPrerequisiteRepository,
    },
  ],
})
export class SubjectsModule {}
