import { Module } from '@nestjs/common';
import { SemesterService } from './domain/port/input/semester.service';
import { SemesterController } from './adapters/driver/semester.controller';
import { SemesterRepository } from './adapters/driven/semester.repository';
import { SEMESTER_REPOSITORY } from './domain/port/output/ISemesterRepository';

@Module({
  exports: [SemesterService],
  controllers: [SemesterController],
  providers: [
    SemesterService,
    {
      provide: SEMESTER_REPOSITORY,
      useClass: SemesterRepository,
    },
  ],
})
export class SemesterModule {}
