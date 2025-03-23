import { Module } from '@nestjs/common';
import { AddressesService } from './domain/port/input/addresses.service';
import { AddressesController } from './adapters/driver/addresses.controller';
import { AddressesRepository } from './adapters/driven/addresses.repository';
import { ADDRESSES_REPOSITORY } from './domain/port/output/IAddressesRepository';
import { STUDENT_REPOSITORY } from '../students/domain/port/output/IStudentRepository';
import { StudentRepository } from '../students/adapters/driven/student.repository';

@Module({
  exports: [AddressesService],
  controllers: [AddressesController],
  providers: [
    AddressesService,
    {
      provide: ADDRESSES_REPOSITORY,
      useClass: AddressesRepository,
    },
  ],
})
export class AddressesModule {}
