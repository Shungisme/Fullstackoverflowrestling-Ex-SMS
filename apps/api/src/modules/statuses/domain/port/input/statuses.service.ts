import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateStatusDTO } from '../../dto/create-status.dto';
import { UpdateStatusDTO } from '../../dto/update-status.dto';
import {
  IStatusesRepository,
  STATUS_REPOSITORY,
} from '../output/IStatusesRepository';
import { IStatusesService } from './IStatusesService';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { StatusesDto } from '../../dto/statuses.dto';
import { TranslationService } from '../../../../translations/domain/port/input/translation.service';

// Các trường có thể dịch
const TRANSLATABLE_FIELDS = ['title', 'description'];

@Injectable()
export class StatusesService implements IStatusesService {
  private readonly logger = new Logger(StatusesService.name);

  constructor(
    @Inject(STATUS_REPOSITORY)
    private statusesRepository: IStatusesRepository,
    private translationService: TranslationService,
  ) {}

  async count(whereOptions: any): Promise<number> {
    try {
      return await this.statusesRepository.count(whereOptions);
    } catch (error) {
      throw new Error(`Error counting statuses: ${error.message}`);
    }
  }

  async create(status: CreateStatusDTO) {
    try {
      // Tạo status trong database
      const createdStatus = await this.statusesRepository.create(status);
      this.logger.log(`Created status with ID: ${createdStatus.id}`);

      // Lưu bản dịch
      const fieldsToTranslate: Record<string, string> = {};
      for (const field of TRANSLATABLE_FIELDS) {
        if (status[field]) {
          fieldsToTranslate[field] = status[field];
        }
      }

      if (Object.keys(fieldsToTranslate).length > 0) {
        try {
          await this.translationService.translateAndSave({
            entity: 'Status',
            entityId: createdStatus.id!,
            fields: fieldsToTranslate,
          });
          this.logger.log(
            `Translations created for status ${createdStatus.id}`,
          );
        } catch (translationError) {
          this.logger.error(
            `Failed to create translations: ${translationError.message}`,
          );
          // Không fail status creation nếu dịch bị lỗi
        }
      }

      return createdStatus;
    } catch (error) {
      throw new Error(`Error creating status: ${error.message}`);
    }
  }

  async delete(statusId: string) {
    try {
      return await this.statusesRepository.delete(statusId);
      // Việc xóa translation không cần thiết (giữ lại lịch sử)
    } catch (error) {
      throw new Error(
        `Error deleting status with ID ${statusId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
    status: string,
    lang?: string,
  ): Promise<PaginatedResponse<StatusesDto>> {
    try {
      const statuses = await this.statusesRepository.findAll(
        page,
        limit,
        status,
      );
      const totalCount = await this.count({ status: status || undefined });

      // Nếu có yêu cầu ngôn ngữ, áp dụng bản dịch
      if (lang) {
        await this.applyTranslationsToList(statuses, lang);
      }

      return {
        data: statuses,
        page,
        totalPage: Math.ceil(totalCount / limit),
        limit,
        total: totalCount,
      };
    } catch (error) {
      throw new Error(`Error finding all statuses: ${error.message}`);
    }
  }

  async findById(statusId: string, lang?: string) {
    try {
      const status = await this.statusesRepository.findById(statusId);

      // Nếu có yêu cầu ngôn ngữ, áp dụng bản dịch
      if (lang) {
        await this.applyTranslation(status, lang);
      }

      return status;
    } catch (error) {
      throw new Error(
        `Error finding status with ID ${statusId}: ${error.message}`,
      );
    }
  }

  async update(statusId: string, data: UpdateStatusDTO) {
    try {
      // Cập nhật status
      const updatedStatus = await this.statusesRepository.update(
        statusId,
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
            entity: 'Status',
            entityId: statusId,
            fields: fieldsToTranslate,
          });
          this.logger.log(`Updated translations for status ${statusId}`);
        } catch (translationError) {
          this.logger.error(
            `Failed to update translations: ${translationError.message}`,
          );
          // Không fail update nếu dịch bị lỗi
        }
      }

      return updatedStatus;
    } catch (error) {
      throw new Error(
        `Error updating status with ID ${statusId}: ${error.message}`,
      );
    }
  }

  // Helper method để áp dụng bản dịch cho một status
  private async applyTranslation(
    status: StatusesDto,
    lang: string,
  ): Promise<void> {
    try {
      const translations = await this.translationService.getAllTranslations(
        'Status',
        status.id!,
        undefined,
        lang,
      );

      if (translations.length === 0) {
        return;
      }

      // Áp dụng các bản dịch vào đối tượng status
      for (const translation of translations) {
        status[translation.field] = translation.value;
      }
    } catch (error) {
      this.logger.error(`Error applying translations: ${error.message}`);
    }
  }

  // Helper method để áp dụng bản dịch cho một danh sách statuses
  private async applyTranslationsToList(
    statuses: StatusesDto[],
    lang: string,
  ): Promise<void> {
    for (const status of statuses) {
      await this.applyTranslation(status, lang);
    }
  }
}
