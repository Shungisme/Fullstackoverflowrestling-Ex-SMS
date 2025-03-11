import { Module } from '@nestjs/common';
import { StudentController } from './adapters/driver/student.controller';
import { StudentService } from './domain/port/input/student.service';
import { StudentRepository } from './adapters/driven/student.repository';
import { STUDENT_REPOSITORY } from './domain/port/output/IStudentRepository';

@Module({
  providers: [
    StudentService,
    {
      provide: STUDENT_REPOSITORY,
      useClass: StudentRepository,
    },
  ],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentsModule {}
