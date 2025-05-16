import { Inject, Injectable, Logger } from '@nestjs/common';
import { translate } from '@vitalets/google-translate-api';
import { CreateTranslationDTO } from '../../dto/create-translation.dto';
import { GetTranslationDTO } from '../../dto/get-translation.dto';
import { TranslationDto } from '../../dto/translation.dto';
import {
  ITranslationRepository,
  TRANSLATION_REPOSITORY,
} from '../output/ITranslationRepository';
import { ITranslationService } from './ITranslationSerive';

const DEFAULT_TARGET_LANGS = ['en', 'vi']; // English and Vietnamese
const TARGET_LANGS = process.env.SUPPORTED_LANGUAGES
  ? process.env.SUPPORTED_LANGUAGES.split(',').map((lang) =>
      lang.trim().toLowerCase(),
    )
  : DEFAULT_TARGET_LANGS;

const ISO_LANGUAGE_CODES = [
  'en',
  'de',
  'fr',
  'es',
  'it',
  'nl',
  'pl',
  'ja',
  'vi',
  'zh',
  'ru',
  'pt',
  'bg',
  'cs',
  'da',
  'et',
  'fi',
  'el',
  'hu',
  'lv',
  'lt',
  'ro',
  'sk',
  'sl',
  'sv',
];

interface Translation {
  entity: string;
  entityId: string;
  field: string;
  lang: string;
  value: string;
}

@Injectable()
export class TranslationService implements ITranslationService {
  private readonly logger = new Logger(TranslationService.name);

  constructor(
    @Inject(TRANSLATION_REPOSITORY)
    private translationRepository: ITranslationRepository,
  ) {
    this.logger.log('Using Google Translate API (free version)');
    this.logger.log(`Supported target languages: ${TARGET_LANGS.join(', ')}`);
  }

  /**
   * Normalize language code to lowercase and validate
   */
  private normalizeLanguageCode(langCode: string): string {
    const normalized = langCode.toLowerCase().trim();

    // Validate if it's a supported language code
    if (!ISO_LANGUAGE_CODES.includes(normalized)) {
      this.logger.warn(`Potentially unsupported language code: ${normalized}`);
    }

    return normalized;
  }

  /**
   * Detect the language of a text string using Google Translate
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      if (!text || text.trim().length === 0) {
        this.logger.warn('Empty text provided for language detection');
        return 'en'; // Default to English for empty text
      }

      // Use a sample of the text if it's very long
      const sampleText = text.length > 500 ? text.substring(0, 500) : text;

      // Use Google Translate for language detection
      const result = await translate(sampleText, { to: 'en' });
      const detectedLang = this.normalizeLanguageCode(
        result.raw.src || 'en', // Use the raw response's source language or default to 'en'
      );

      this.logger.debug(
        `Google detected language: ${detectedLang} for text: "${text.substring(0, 30)}..."`,
      );

      return detectedLang;
    } catch (error) {
      this.logger.error(`Language detection error: ${error.message}`);

      // Fallback: Simple Vietnamese detection
      const vietnamesePattern =
        /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
      if (vietnamesePattern.test(text)) {
        return 'vi';
      }

      // Default to English on error
      return 'en';
    }
  }

  /**
   * Translate text using Google Translate
   */
  private async translateText(
    text: string,
    sourceLang: string,
    targetLang: string,
  ): Promise<string> {
    try {
      const result = await translate(text, {
        from: sourceLang,
        to: targetLang,
      });

      return result.text;
    } catch (error) {
      this.logger.error(`Translation error: ${error.message}`);

      // Return original text with language prefix on error instead of failing
      return `[${targetLang.toUpperCase()}] ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`;
    }
  }

  async translateAndSave(data: CreateTranslationDTO): Promise<void> {
    try {
      // Empty fields check
      if (!data.fields || Object.keys(data.fields).length === 0) {
        throw new Error('No fields provided for translation');
      }

      // Detect source language from first field
      const firstValue = Object.values(data.fields)[0];
      const sourceLang = await this.detectLanguage(firstValue);
      this.logger.log(`Source language detected: ${sourceLang}`);

      const translationsToCreate: Translation[] = [];

      // Save the original texts
      for (const [field, value] of Object.entries(data.fields)) {
        translationsToCreate.push({
          entity: data.entity,
          entityId: data.entityId,
          field,
          lang: sourceLang,
          value,
        });
      }

      // Get target langs excluding the source language
      const targetLangs = TARGET_LANGS.filter((lang) => lang !== sourceLang);

      if (targetLangs.length === 0) {
        this.logger.warn('No target languages to translate to.');
        await this.translationRepository.createMany(translationsToCreate);
        return;
      }

      // Translate and save for each target language
      for (const targetLang of targetLangs) {
        for (const [field, value] of Object.entries(data.fields)) {
          try {
            // Skip empty values
            if (!value || value.trim().length === 0) {
              this.logger.debug(`Skipping empty value for field: ${field}`);
              continue;
            }

            // Skip translation for very large texts
            if (value.length > 5000) {
              this.logger.warn(
                `Text too large for translation in field: ${field}. Character count: ${value.length}`,
              );
              continue;
            }

            const normalizedTargetLang = this.normalizeLanguageCode(targetLang);
            const normalizedSourceLang = this.normalizeLanguageCode(sourceLang);

            // Translate using Google Translate
            const translatedText = await this.translateText(
              value,
              normalizedSourceLang,
              normalizedTargetLang,
            );

            translationsToCreate.push({
              entity: data.entity,
              entityId: data.entityId,
              field,
              lang: normalizedTargetLang,
              value: translatedText,
            });

            this.logger.debug(
              `Translated ${field} from ${sourceLang} to ${normalizedTargetLang}`,
            );
          } catch (error) {
            this.logger.error(
              `Error translating ${field} to ${targetLang}: ${error.message}`,
            );
          }
        }
      }

      // Save all translations to the database
      await this.translationRepository.createMany(translationsToCreate);
      this.logger.log(
        `Saved ${translationsToCreate.length} translations for ${data.entity} ID: ${data.entityId}`,
      );
    } catch (error) {
      this.logger.error(`Error in translateAndSave: ${error.message}`);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  async getTranslation(
    data: GetTranslationDTO,
  ): Promise<TranslationDto | null> {
    try {
      return await this.translationRepository.findOne(
        data.entity,
        data.entityId,
        data.field,
        data.lang,
      );
    } catch (error) {
      this.logger.error(`Error getting translation: ${error.message}`);
      throw new Error(`Failed to get translation: ${error.message}`);
    }
  }

  async getAllTranslations(
    entity: string,
    entityId: string,
    field?: string,
    lang?: string,
  ): Promise<TranslationDto[]> {
    try {
      return await this.translationRepository.findAll(
        entity,
        entityId,
        field,
        lang,
      );
    } catch (error) {
      this.logger.error(`Error getting translations: ${error.message}`);
      throw new Error(`Failed to get translations: ${error.message}`);
    }
  }

  /**
   * Delete translations for a given entity and entityId
   * Optional field parameter to delete only translations for a specific field
   */
  async deleteTranslations(
    entity: string,
    entityId: string,
    field?: string,
  ): Promise<number> {
    try {
      const count = await this.translationRepository.deleteMany(
        entity,
        entityId,
      );
      this.logger.log(
        `Deleted ${count} translations for ${entity} ${entityId}${field ? `, field ${field}` : ''}`,
      );
      return count;
    } catch (error) {
      this.logger.error(`Error deleting translations: ${error.message}`);
      throw new Error(`Failed to delete translations: ${error.message}`);
    }
  }
}
