import { Module } from '@nestjs/common';
import { TranslationController } from './adapters/driver/translation.controller';
import { TranslationRepository } from './adapters/driven/translation.repository';
import { SharedModule } from 'src/shared/services/shared.module';
import { TRANSLATION_REPOSITORY } from './domain/port/output/ITranslationRepository';
import { TranslationService } from './domain/port/input/translation.service';

@Module({
  imports: [SharedModule],
  controllers: [TranslationController],
  providers: [
    TranslationService,
    {
      provide: TRANSLATION_REPOSITORY,
      useClass: TranslationRepository,
    },
  ],
  exports: [TranslationService],
})
export class TranslationsModule {}
