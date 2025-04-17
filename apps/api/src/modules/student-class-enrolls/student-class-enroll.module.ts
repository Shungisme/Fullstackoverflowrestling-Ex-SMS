import { Module } from '@nestjs/common';
import { StudentClassEnrollService } from './domain/port/input/student-class-enroll.service';
import { StudentClassEnrollController } from './adapters/driver/student-class-enroll.controller';
import { StudentClassEnrollRepository } from './adapters/driven/student-class-enroll.repository';
import { STUDENT_CLASS_ENROLL_REPOSITORY } from './domain/port/output/IStudentClassEnrollRepository';

@Module({
  exports: [StudentClassEnrollService],
  controllers: [StudentClassEnrollController],
  providers: [
    StudentClassEnrollService,
    {
      provide: STUDENT_CLASS_ENROLL_REPOSITORY,
      useClass: StudentClassEnrollRepository,
    },
  ],
})
export class StudentClassEnrollModule {}
