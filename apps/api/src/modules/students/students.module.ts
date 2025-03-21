import { Module } from '@nestjs/common';
import { StudentController } from './adapters/driver/student.controller';
import { StudentService } from './domain/port/input/student.service';
import { StudentRepository } from './adapters/driven/student.repository';
import { STUDENT_REPOSITORY } from './domain/port/output/IStudentRepository';
import { PROGRAM_REPOSITORY } from '../programs/domain/port/output/IProgramsRepository';
import { ProgramsRepository } from '../programs/adapters/driven/programs.repository';
import { FACULTIES_REPOSITORY } from '../faculties/domain/port/output/IFacultiesRepository';
import { FacultiesRepository } from '../faculties/adapters/driven/faculties.repository';
import { STATUS_REPOSITORY } from '../statuses/domain/port/output/IStatusesRepository';
import { StatusesRepository } from '../statuses/adapters/driven/statuses.repository';
import { IDENTITY_REPOSITORY } from '../identity-papers/domain/port/output/IIdentityPapersRepository';
import { IdentityPapersRepository } from '../identity-papers/adapters/driven/identity-papers.repository';
import { ADDRESSES_REPOSITORY } from '../addresses/domain/port/output/IAddressesRepository';
import { AddressesRepository } from '../addresses/adapters/driven/addresses.repository';

@Module({
  providers: [
    StudentService,
    {
      provide: STUDENT_REPOSITORY,
      useClass: StudentRepository,
    },
    {
      provide: PROGRAM_REPOSITORY,
      useClass: ProgramsRepository,
    },
    {
      provide: FACULTIES_REPOSITORY,
      useClass: FacultiesRepository,
    },
    {
      provide: STATUS_REPOSITORY,
      useClass: StatusesRepository,
    },
    {
      provide: IDENTITY_REPOSITORY,
      useClass: IdentityPapersRepository,
    },
    {
      provide: FACULTIES_REPOSITORY,
      useClass: FacultiesRepository,
    },
    {
      provide: ADDRESSES_REPOSITORY,
      useClass: AddressesRepository,
    },
  ],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentsModule {}
