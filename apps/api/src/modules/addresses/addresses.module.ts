import { Module } from '@nestjs/common';
import { AddressesService } from './domain/port/input/addresses.service';
import { AddressesController } from './adapters/driver/addresses.controller';
import { AddressesRepository } from './adapters/driven/addresses.repository';

@Module({
  exports: [AddressesService],
  controllers: [AddressesController],
  providers: [
    AddressesService,
    {
      provide: 'IAddressesRepository',
      useClass: AddressesRepository,
    },
  ],
})
export class AddressesModule {}
