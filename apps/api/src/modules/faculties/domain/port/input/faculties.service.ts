import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateFacultyDTO } from '../../dto/create-faculty.dto';
import { UpdateFacultyDTO } from '../../dto/update-faculty.dto';
import {
  FACULTIES_REPOSITORY,
  IFacultiesRepository,
} from '../output/IFacultiesRepository';
import { IFacultiesService } from './IFaculitiesService';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { FacultiesDto } from '../../dto/faculties.dto';
import { TranslationService } from '../../../../translations/domain/port/input/translation.service';

// Các trường có thể dịch
const TRANSLATABLE_FIELDS = ['title', 'description'];

@Injectable()
export class FacultiesService implements IFacultiesService {
  private readonly logger = new Logger(FacultiesService.name);

  constructor(
    @Inject(FACULTIES_REPOSITORY)
    private facultiesRepository: IFacultiesRepository,
    private translationService: TranslationService,
  ) {}

  async count(whereOptions: any): Promise<number> {
    try {
      return await this.facultiesRepository.count(whereOptions);
    } catch (error) {
      throw new Error(`Error counting faculties: ${error.message}`);
    }
  }

  async create(faculty: CreateFacultyDTO) {
    try {
      // Tạo faculty trong database
      const createdFaculty = await this.facultiesRepository.create(faculty);
      this.logger.log(`Created faculty with ID: ${createdFaculty.id}`);

      // Lưu bản dịch
      const fieldsToTranslate: Record<string, string> = {};
      for (const field of TRANSLATABLE_FIELDS) {
        if (faculty[field]) {
          fieldsToTranslate[field] = faculty[field];
        }
      }

      if (Object.keys(fieldsToTranslate).length > 0) {
        try {
          await this.translationService.translateAndSave({
            entity: 'Faculty',
            entityId: createdFaculty.id!,
            fields: fieldsToTranslate,
          });
          this.logger.log(
            `Translations created for faculty ${createdFaculty.id}`,
          );
        } catch (translationError) {
          this.logger.error(
            `Failed to create translations: ${translationError.message}`,
          );
          // Không fail tạo faculty nếu dịch bị lỗi
        }
      }

      return createdFaculty;
    } catch (error) {
      throw new Error(`Error creating faculty: ${error.message}`);
    }
  }

  async delete(facultyId: string) {
    try {
      return await this.facultiesRepository.delete(facultyId);
      // Translation data không cần xóa (giữ lại lịch sử)
    } catch (error) {
      throw new Error(
        `Error deleting faculty with ID ${facultyId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
    status: string,
    lang?: string,
  ): Promise<PaginatedResponse<FacultiesDto>> {
    try {
      const faculties = await this.facultiesRepository.findAll(
        page,
        limit,
        status,
      );
      const totalFaculties = faculties.length;

      // Nếu có yêu cầu ngôn ngữ, áp dụng bản dịch
      if (lang) {
        await this.applyTranslationsToList(faculties, lang);
      }

      return {
        data: faculties,
        page,
        totalPage: Math.ceil(totalFaculties / limit),
        limit,
        total: totalFaculties,
      };
    } catch (error) {
      throw new Error(`Error finding all faculties: ${error.message}`);
    }
  }

  async findById(facultyId: string, lang?: string) {
    try {
      const faculty = await this.facultiesRepository.findById(facultyId);

      // Nếu có yêu cầu ngôn ngữ, áp dụng bản dịch
      if (lang) {
        await this.applyTranslation(faculty, lang);
      }

      return faculty;
    } catch (error) {
      throw new Error(
        `Error finding faculty with ID ${facultyId}: ${error.message}`,
      );
    }
  }

  async update(facultyId: string, data: UpdateFacultyDTO) {
    try {
      // Cập nhật faculty
      const updatedFaculty = await this.facultiesRepository.update(
        facultyId,
        data,
      );

      // Cập nhật bản dịch nếu các trường có thể dịch được thay đổi
      const fieldsToTranslate: Record<string, string> = {};
      for (const field of TRANSLATABLE_FIELDS) {
        if (data[field] !== undefined) {
          fieldsToTranslate[field] = data[field];
        }
      }

      if (Object.keys(fieldsToTranslate).length > 0) {
        try {
          await this.translationService.translateAndSave({
            entity: 'Faculty',
            entityId: facultyId,
            fields: fieldsToTranslate,
          });
          this.logger.log(`Updated translations for faculty ${facultyId}`);
        } catch (translationError) {
          this.logger.error(
            `Failed to update translations: ${translationError.message}`,
          );
          // Không fail update nếu dịch bị lỗi
        }
      }

      return updatedFaculty;
    } catch (error) {
      throw new Error(
        `Error updating faculty with ID ${facultyId}: ${error.message}`,
      );
    }
  }

  // Helper method để áp dụng bản dịch cho một faculty
  private async applyTranslation(
    faculty: FacultiesDto,
    lang: string,
  ): Promise<void> {
    try {
      const translations = await this.translationService.getAllTranslations(
        'Faculty',
        faculty.id!,
        undefined,
        lang,
      );

      if (translations.length === 0) {
        return;
      }

      // Áp dụng các bản dịch vào đối tượng faculty
      for (const translation of translations) {
        faculty[translation.field] = translation.value;
      }
    } catch (error) {
      this.logger.error(`Error applying translations: ${error.message}`);
    }
  }

  // Helper method để áp dụng bản dịch cho một danh sách faculties
  private async applyTranslationsToList(
    faculties: FacultiesDto[],
    lang: string,
  ): Promise<void> {
    for (const faculty of faculties) {
      await this.applyTranslation(faculty, lang);
    }
  }
}
