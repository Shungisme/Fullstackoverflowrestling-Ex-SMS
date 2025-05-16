import { TranslationDto } from '../../dto/translation.dto';

export interface ITranslationRepository {
  createMany(data: any[]): Promise<number>;

  findOne(
    entity: string,
    entityId: string,
    field: string,
    lang: string,
  ): Promise<TranslationDto | null>;

  findAll(
    entity: string,
    entityId: string,
    field?: string,
    lang?: string,
  ): Promise<TranslationDto[]>;

  deleteMany(entity: string, entityId: string): Promise<number>;
}

export const TRANSLATION_REPOSITORY = Symbol('ITranslationRepository');
