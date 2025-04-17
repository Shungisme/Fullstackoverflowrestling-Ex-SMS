import { Module } from '@nestjs/common';
import { StudentClassResultService } from './domain/port/input/student-class-result.service';
import { StudentClassResultController } from './adapters/driver/student-class-result.controller';
import { StudentClassResultRepository } from './adapters/driven/student-class-result.repository';
import { STUDENT_CLASS_RESULT_REPOSITORY } from './domain/port/output/IStudentClassResultRepository';

@Module({
  exports: [StudentClassResultService],
  controllers: [StudentClassResultController],
  providers: [
    StudentClassResultService,
    {
      provide: STUDENT_CLASS_RESULT_REPOSITORY,
      useClass: StudentClassResultRepository,
    },
  ],
})
export class StudentClassResultModule {}
