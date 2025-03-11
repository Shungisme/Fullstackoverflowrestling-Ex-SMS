import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './modules/students/students.module';
import { SharedModule } from './shared/services/shared.module';

@Module({
  imports: [StudentsModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
