import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './modules/students/students.module';
import { SharedModule } from './shared/services/shared.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ResponseInterceptor } from './shared/core/interceptors/response-interceptor';
import { FacultiesModule } from './modules//faculties/faculties.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { ProgramsModule } from './modules/programs/programs.module';

@Module({
  imports: [
    SharedModule,
    StudentsModule,
    FacultiesModule,
    AddressesModule,
    ProgramsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
export class AppModule {}
