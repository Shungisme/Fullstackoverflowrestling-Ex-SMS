import { Module } from '@nestjs/common';
import { ClassesService } from './domain/port/input/classes.service';
import { ClassesController } from './adapters/driver/classes.controller';
import { ClassesRepository } from './adapters/driven/classes.repository';
import { CLASSES_REPOSITORY } from './domain/port/output/IClassesRepository';

@Module({
  exports: [ClassesService],
  controllers: [ClassesController],
  providers: [
    ClassesService,
    {
      provide: CLASSES_REPOSITORY,
      useClass: ClassesRepository,
    },
  ],
})
export class ClassesModule {}
