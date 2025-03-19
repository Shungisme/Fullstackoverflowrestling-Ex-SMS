import { Module } from '@nestjs/common';
import { StatusesService } from './domain/port/input/statuses.service';
import { StatusesController } from './adapters/driver/statuses.controller';
import { StatusesRepository } from './adapters/driven/statuses.repository';

@Module({
  exports: [StatusesService],
  controllers: [StatusesController],
  providers: [
    StatusesService,
    {
      provide: 'IStatusesRepository',
      useClass: StatusesRepository,
    },
  ],
})
export class StatusesModule {}
