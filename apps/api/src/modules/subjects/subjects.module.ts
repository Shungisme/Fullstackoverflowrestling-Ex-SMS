import { Module } from '@nestjs/common';
import { SubjectsService } from './domain/port/input/subjects.service';
import { SubjectsController } from './adapters/driver/subjects.controller';
import { SubjectsRepository } from './adapters/driven/subjects.repository';
import { SUBJECTS_REPOSITORY } from './domain/port/output/ISubjectsRepository';
import { StudentClassEnrollRepository } from '../student-class-enrolls/adapters/driven/student-class-enroll.repository';
import { ClassesRepository } from '../classes/adapters/driven/classes.repository';
import { CLASSES_REPOSITORY } from '../classes/domain/port/output/IClassesRepository';
import { STUDENT_CLASS_ENROLL_REPOSITORY } from '../student-class-enrolls/domain/port/output/IStudentClassEnrollRepository';

@Module({
  exports: [SubjectsService],
  controllers: [SubjectsController],
  providers: [
    SubjectsService,
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
  ],
})
export class SubjectsModule {}
