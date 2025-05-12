import { Module } from '@nestjs/common';
import { ProgramsService } from './domain/port/input/programs.service';
import { ProgramsController } from './adapters/driver/programs.controller';
import { ProgramsRepository } from './adapters/driven/programs.repository';
import { PROGRAM_REPOSITORY } from './domain/port/output/IProgramsRepository';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { TranslationsModule } from '../translations/translation.module';

@Module({
  imports: [TranslationsModule], // Thêm TranslationsModule
  exports: [ProgramsService],
  controllers: [ProgramsController],
  providers: [
    ProgramsService,
    PrismaService,
    {
      provide: PROGRAM_REPOSITORY,
      useClass: ProgramsRepository,
    },
  ],
})
export class ProgramsModule {}
