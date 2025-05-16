import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateProgramDTO } from '../../dto/create-program.dto';
import { UpdateProgramDTO } from '../../dto/update-program.dto';
import {
  PROGRAM_REPOSITORY,
  IProgramsRepository,
} from '../output/IProgramsRepository';
import { IProgramsService } from './IProgramsService';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { ProgramsDto } from '../../dto/programs.dto';
import { TranslationService } from '../../../../translations/domain/port/input/translation.service';

// Các trường có thể dịch
const TRANSLATABLE_FIELDS = ['title', 'description'];

@Injectable()
export class ProgramsService implements IProgramsService {
  private readonly logger = new Logger(ProgramsService.name);

  constructor(
    @Inject(PROGRAM_REPOSITORY)
    private programsRepository: IProgramsRepository,
    private translationService: TranslationService, // Thêm TranslationService
  ) {}

  async count(whereOptions: any): Promise<number> {
    try {
      return await this.programsRepository.count(whereOptions);
    } catch (error) {
      throw new Error(`Error counting programs: ${error.message}`);
    }
  }

  async create(program: CreateProgramDTO) {
    try {
      // Tạo program trong database
      const createdProgram = await this.programsRepository.create(program);
      this.logger.log(`Created program with ID: ${createdProgram.id}`);

      // Lưu bản dịch
      const fieldsToTranslate: Record<string, string> = {};
      for (const field of TRANSLATABLE_FIELDS) {
        if (program[field]) {
          fieldsToTranslate[field] = program[field];
        }
      }

      if (Object.keys(fieldsToTranslate).length > 0) {
        try {
          await this.translationService.translateAndSave({
            entity: 'Program',
            entityId: createdProgram.id!,
            fields: fieldsToTranslate,
          });
          this.logger.log(
            `Translations created for program ${createdProgram.id}`,
          );
        } catch (translationError) {
          this.logger.error(
            `Failed to create translations: ${translationError.message}`,
          );
          // Không fail tạo program nếu dịch bị lỗi
        }
      }

      return createdProgram;
    } catch (error) {
      throw new Error(`Error creating program: ${error.message}`);
    }
  }

  async delete(programId: string) {
    try {
      // Xóa các bản dịch liên quan đến chương trình
      try {
        // Lấy tất cả bản dịch của chương trình
        const translations = await this.translationService.getAllTranslations(
          'Program',
          programId,
        );

        // Nếu có bản dịch nào, xóa tất cả
        if (translations.length > 0) {
          this.logger.log(
            `Deleting ${translations.length} translations for program ${programId}`,
          );

          const deletedCount = await this.translationService[
            'translationRepository'
          ].deleteMany('Program', programId);

          this.logger.log(
            `Successfully deleted ${deletedCount} translations for program ${programId}`,
          );
        }
      } catch (translationError) {
        this.logger.error(
          `Error deleting translations for program ${programId}: ${translationError.message}`,
        );
      }

      // Xóa chương trình
      return await this.programsRepository.delete(programId);
    } catch (error) {
      throw new Error(
        `Error deleting program with ID ${programId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
    status: string,
    lang?: string,
  ): Promise<PaginatedResponse<ProgramsDto>> {
    try {
      const programs = await this.programsRepository.findAll(
        page,
        limit,
        status,
      );
      const totalCount = await this.count({ status });

      // Nếu có yêu cầu ngôn ngữ, áp dụng bản dịch
      if (lang) {
        await this.applyTranslationsToList(programs, lang);
      }

      return {
        data: programs,
        page,
        totalPage: Math.ceil(totalCount / limit),
        limit,
        total: totalCount,
      };
    } catch (error) {
      throw new Error(`Error finding all programs: ${error.message}`);
    }
  }

  async findById(programId: string, lang?: string) {
    try {
      const program = await this.programsRepository.findById(programId);

      // Nếu có yêu cầu ngôn ngữ, áp dụng bản dịch
      if (lang) {
        await this.applyTranslation(program, lang);
      }

      return program;
    } catch (error) {
      throw new Error(
        `Error finding program with ID ${programId}: ${error.message}`,
      );
    }
  }

  async update(programId: string, data: UpdateProgramDTO) {
    try {
      // Cập nhật program
      const updatedProgram = await this.programsRepository.update(
        programId,
        data,
      );

      // Xác định các trường dịch được thay đổi
      const fieldsToTranslate: Record<string, string> = {};
      for (const field of TRANSLATABLE_FIELDS) {
        if (data[field] !== undefined) {
          fieldsToTranslate[field] = data[field];
        }
      }

      if (Object.keys(fieldsToTranslate).length > 0) {
        try {
          // Xóa các bản dịch cũ cho các trường sẽ được cập nhật
          for (const field of Object.keys(fieldsToTranslate)) {
            try {
              const translations =
                await this.translationService.getAllTranslations(
                  'Program',
                  programId,
                  field,
                );

              if (translations.length > 0) {
                this.logger.log(
                  `Deleting existing translations for program ${programId}, field ${field}`,
                );

                // Xóa từng bản dịch của trường này
                await this.translationService[
                  'translationRepository'
                ].deleteMany('Program', programId);
              }
            } catch (deleteError) {
              this.logger.error(
                `Failed to delete old translations for field ${field}: ${deleteError.message}`,
              );
            }
          }

          // Tạo các bản dịch mới sau khi đã xóa bản dịch cũ
          await this.translationService.translateAndSave({
            entity: 'Program',
            entityId: programId,
            fields: fieldsToTranslate,
          });
          this.logger.log(`Updated translations for program ${programId}`);
        } catch (translationError) {
          this.logger.error(
            `Failed to update translations: ${translationError.message}`,
          );
        }
      }

      return updatedProgram;
    } catch (error) {
      throw new Error(
        `Error updating program with ID ${programId}: ${error.message}`,
      );
    }
  }

  // Helper method để áp dụng bản dịch cho một program
  private async applyTranslation(
    program: ProgramsDto,
    lang: string,
  ): Promise<void> {
    try {
      const translations = await this.translationService.getAllTranslations(
        'Program',
        program.id!,
        undefined,
        lang,
      );

      if (translations.length === 0) {
        return;
      }

      // Áp dụng các bản dịch vào đối tượng program
      for (const translation of translations) {
        program[translation.field] = translation.value;
      }
    } catch (error) {
      this.logger.error(`Error applying translations: ${error.message}`);
    }
  }

  // Helper method để áp dụng bản dịch cho một danh sách programs
  private async applyTranslationsToList(
    programs: ProgramsDto[],
    lang: string,
  ): Promise<void> {
    for (const program of programs) {
      await this.applyTranslation(program, lang);
    }
  }
}
