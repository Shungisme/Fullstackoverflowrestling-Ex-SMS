import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from './shared/logger/logger.module';
import { HttpLoggerMiddleware } from './shared/middlewares/http-logger.middleware';
import { StudentsModule } from './modules/students/students.module';
import { SharedModule } from './shared/services/shared.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ResponseInterceptor } from './shared/core/interceptors/response-interceptor';
import { FacultiesModule } from './modules//faculties/faculties.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { StatusesModule } from './modules/statuses/statuses.module';
import { IdentityPapersModule } from './modules/identity-papers/identity-papers.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { SubjectPrerequisitesModule } from './modules/subject-prerequisites/subject-prerequisites.module';
import { ClassesModule } from './modules/classes/classes.module';
import { SemesterModule } from './modules/semesters/semester.module';
import { StudentClassResultModule } from './modules/student-class-results/student-class-result.module';
import { StudentClassEnrollModule } from './modules/student-class-enrolls/student-class-enroll.module';

@Module({
  imports: [
    LoggerModule,
    SharedModule,
    StudentsModule,
    FacultiesModule,
    AddressesModule,
    ProgramsModule,
    StatusesModule,
    IdentityPapersModule,
    SubjectsModule,
    SubjectPrerequisitesModule,
    ClassesModule,
    SemesterModule,
    StudentClassResultModule,
    StudentClassEnrollModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
