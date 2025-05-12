import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { ITranslationRepository } from '../../domain/port/output/ITranslationRepository';
import { TranslationDto } from '../../domain/dto/translation.dto';

@Injectable()
export class TranslationRepository implements ITranslationRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(data: any[]): Promise<number> {
    const result = await this.prisma.translation.createMany({
      data,
    });

    return result.count;
  }

  async findOne(
    entity: string,
    entityId: string,
    field: string,
    lang: string,
  ): Promise<TranslationDto | null> {
    return this.prisma.translation.findFirst({
      where: {
        entity,
        entityId,
        field,
        lang,
      },
    });
  }

  async findAll(
    entity: string,
    entityId: string,
    field?: string,
    lang?: string,
  ): Promise<TranslationDto[]> {
    const where: any = {
      entity,
      entityId,
    };

    if (field) {
      where.field = field;
    }

    if (lang) {
      where.lang = lang;
    }

    return this.prisma.translation.findMany({
      where,
      orderBy: [{ field: 'asc' }, { lang: 'asc' }],
    });
  }
}
