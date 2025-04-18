import { Module } from '@nestjs/common';
import { StudentClassEnrollService } from './domain/port/input/student-class-enroll.service';
import { StudentClassEnrollController } from './adapters/driver/student-class-enroll.controller';
import { StudentClassEnrollRepository } from './adapters/driven/student-class-enroll.repository';
import { STUDENT_CLASS_ENROLL_REPOSITORY } from './domain/port/output/IStudentClassEnrollRepository';
import { Student } from '../students/adapters/driven/types/student-type';
import { SUBJECT_PREREQUISITE_REPOSITORY } from '../subject-prerequisites/domain/port/output/ISubjectPrerequisiteRepository';
import { SubjectPrerequisiteRepository } from '../subject-prerequisites/adapters/driven/subject-prerequisite.repository';
import { STUDENT_CLASS_RESULT_REPOSITORY } from '../student-class-results/domain/port/output/IStudentClassResultRepository';
import { StudentClassResultRepository } from '../student-class-results/adapters/driven/student-class-result.repository';
import { SEMESTER_REPOSITORY } from '../semesters/domain/port/output/ISemesterRepository';
import { SemesterRepository } from '../semesters/adapters/driven/semester.repository';
import { CLASSES_REPOSITORY } from '../classes/domain/port/output/IClassesRepository';
import { ClassesRepository } from '../classes/adapters/driven/classes.repository';

@Module({
  exports: [StudentClassEnrollService],
  controllers: [StudentClassEnrollController],
  providers: [
    StudentClassEnrollService,
    {
      provide: STUDENT_CLASS_ENROLL_REPOSITORY,
      useClass: StudentClassEnrollRepository,
    },
    {
      provide: SUBJECT_PREREQUISITE_REPOSITORY,
      useClass: SubjectPrerequisiteRepository,
    },
    {
      provide: STUDENT_CLASS_RESULT_REPOSITORY,
      useClass: StudentClassResultRepository,
    },
    {
      provide: SEMESTER_REPOSITORY,
      useClass: SemesterRepository,
    },
    {
      provide: CLASSES_REPOSITORY,
      useClass: ClassesRepository,
    },
  ],
})
export class StudentClassEnrollModule {}
