import { Module } from '@nestjs/common';
import { FacultiesService } from './domain/port/input/faculties.service';
import { FacultiesController } from './adapters/driver/faculties.controller';
import { FacultiesRepository } from './adapters/driven/faculties.repository';
import { FACULTIES_REPOSITORY } from './domain/port/output/IFacultiesRepository';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { TranslationsModule } from '../translations/translation.module';

@Module({
  imports: [TranslationsModule],
  exports: [FacultiesService],
  controllers: [FacultiesController],
  providers: [
    FacultiesService,
    PrismaService,
    {
      provide: FACULTIES_REPOSITORY,
      useClass: FacultiesRepository,
    },
  ],
})
export class FacultiesModule {}
