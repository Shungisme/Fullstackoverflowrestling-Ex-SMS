import { CreateTranslationDTO } from '../../dto/create-translation.dto';
import { GetTranslationDTO } from '../../dto/get-translation.dto';
import { TranslationDto } from '../../dto/translation.dto';

export interface ITranslationService {
  detectLanguage(text: string): Promise<string>;

  translateAndSave(data: CreateTranslationDTO): Promise<void>;

  getTranslation(data: GetTranslationDTO): Promise<TranslationDto | null>;

  getAllTranslations(
    entity: string,
    entityId: string,
    field?: string,
    lang?: string,
  ): Promise<TranslationDto[]>;
}
