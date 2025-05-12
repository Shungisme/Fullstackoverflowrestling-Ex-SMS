import { Module } from '@nestjs/common';
import { StatusesService } from './domain/port/input/statuses.service';
import { StatusesController } from './adapters/driver/statuses.controller';
import { StatusesRepository } from './adapters/driven/statuses.repository';
import { STATUS_REPOSITORY } from './domain/port/output/IStatusesRepository';
import { TranslationsModule } from '../translations/translation.module';

@Module({
  imports: [TranslationsModule],
  exports: [StatusesService],
  controllers: [StatusesController],
  providers: [
    StatusesService,
    {
      provide: STATUS_REPOSITORY,
      useClass: StatusesRepository,
    },
  ],
})
export class StatusesModule {}
