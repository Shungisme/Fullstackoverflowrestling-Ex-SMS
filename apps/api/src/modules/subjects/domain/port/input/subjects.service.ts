import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateSubjectDTO } from '../../dto/create-subject.dto';
import { UpdateSubjectDTO } from '../../dto/update-subject.dto';
import {
  SUBJECTS_REPOSITORY,
  ISubjectsRepository,
} from '../output/ISubjectsRepository';
import { ISubjectsService } from './ISubjectsService';
import { PaginatedResponse } from '../../../../../shared/types/PaginatedResponse';
import { SubjectsDto } from '../../dto/subjects.dto';
import {
  IStudentClassEnrollRepository,
  STUDENT_CLASS_ENROLL_REPOSITORY,
} from '../../../../student-class-enrolls/domain/port/output/IStudentClassEnrollRepository';
import {
  CLASSES_REPOSITORY,
  IClassesRepository,
} from '../../../../classes/domain/port/output/IClassesRepository';
import {
  ISubjectPrerequisiteRepository,
  SUBJECT_PREREQUISITE_REPOSITORY,
} from '../../../../subject-prerequisites/domain/port/output/ISubjectPrerequisiteRepository';
import { TranslationService } from '../../../../translations/domain/port/input/translation.service';

// Các trường có thể dịch
const TRANSLATABLE_FIELDS = ['title', 'description'];

@Injectable()
export class SubjectsService implements ISubjectsService {
  private readonly logger = new Logger(SubjectsService.name);

  constructor(
    @Inject(SUBJECTS_REPOSITORY)
    private subjectsRepository: ISubjectsRepository,

    @Inject(STUDENT_CLASS_ENROLL_REPOSITORY)
    private studentClassEnrollRepository: IStudentClassEnrollRepository,

    @Inject(CLASSES_REPOSITORY)
    private classesRepository: IClassesRepository,

    @Inject(SUBJECT_PREREQUISITE_REPOSITORY)
    private subjectPrerequisiteRepository: ISubjectPrerequisiteRepository,

    private translationService: TranslationService,
  ) {}

  async count(whereOptions: any): Promise<number> {
    try {
      return await this.subjectsRepository.count(whereOptions);
    } catch (error) {
      throw new Error(`Error counting subjects: ${error.message}`);
    }
  }

  async create(subject: CreateSubjectDTO) {
    try {
      // Không cần kiểm tra prerequisites khi tạo mới subject
      // vì subject chưa tồn tại nên không thể có prerequisites

      // Tạo subject trong cơ sở dữ liệu
      const createdSubject = await this.subjectsRepository.create(subject);
      this.logger.log(`Created subject with ID: ${createdSubject.id}`);

      // Lưu bản dịch nếu có
      const fieldsToTranslate: Record<string, string> = {};
      for (const field of TRANSLATABLE_FIELDS) {
        if (subject[field]) {
          fieldsToTranslate[field] = subject[field];
        }
      }

      if (Object.keys(fieldsToTranslate).length > 0) {
        try {
          await this.translationService.translateAndSave({
            entity: 'Subject',
            entityId: createdSubject.id!,
            fields: fieldsToTranslate,
          });
          this.logger.log(
            `Translations created for subject ${createdSubject.id}`,
          );
        } catch (translationError) {
          this.logger.error(
            `Failed to create translations: ${translationError.message}`,
          );
          // Không fail subject creation nếu translation lỗi
        }
      }

      return createdSubject;
    } catch (error) {
      throw new Error(`Error creating subject: ${error.message}`);
    }
  }

  async delete(subjectId: string) {
    try {
      const subject = await this.subjectsRepository.findById(subjectId);

      const current = new Date();
      const thirtyMinutesAgo = new Date(current.getTime() - 30 * 60 * 1000);
      if (subject.createdAt && subject.createdAt <= thirtyMinutesAgo) {
        throw new Error(
          `Cannot delete subject with ID ${subjectId} because it was created more than 30 minutes ago`,
        );
      } else {
        const classes = await this.classesRepository.findBySubjectCode(
          subject.code,
        );

        if (classes.length > 0) {
          return this.subjectsRepository.update(subjectId, {
            status: 'DEACTIVATED',
          });
        }

        // Xóa các bản dịch liên quan đến subject trước khi xóa subject
        try {
          // Lấy tất cả bản dịch của subject
          const translations = await this.translationService.getAllTranslations(
            'Subject',
            subjectId,
          );

          // Nếu có bản dịch nào, xóa tất cả
          if (translations.length > 0) {
            this.logger.log(
              `Deleting ${translations.length} translations for subject ${subjectId}`,
            );

            const deletedCount = await this.translationService[
              'translationRepository'
            ].deleteMany('Subject', subjectId);

            this.logger.log(
              `Successfully deleted ${deletedCount} translations for subject ${subjectId}`,
            );
          }
        } catch (translationError) {
          this.logger.error(
            `Error deleting translations for subject ${subjectId}: ${translationError.message}`,
          );
        }

        // Xóa subject
        return await this.subjectsRepository.delete(subjectId);
      }
    } catch (error) {
      throw new Error(
        `Error deleting subject with ID ${subjectId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
    status: string,
    facultyId?: string,
    lang?: string,
  ): Promise<PaginatedResponse<SubjectsDto>> {
    try {
      const subjects = await this.subjectsRepository.findAll(
        page,
        limit,
        status,
        facultyId,
      );

      const totalCount = await this.count({
        status: status || undefined,
        facultyId: facultyId || undefined,
      });

      // Nếu có yêu cầu ngôn ngữ, áp dụng bản dịch
      if (lang) {
        await this.applyTranslationsToList(subjects, lang);
      }

      return {
        data: subjects,
        page,
        totalPage: Math.ceil(totalCount / limit),
        limit,
        total: totalCount,
      };
    } catch (error) {
      throw new Error(`Error finding all subjects: ${error.message}`);
    }
  }

  async findById(subjectId: string, lang?: string) {
    try {
      const subject = await this.subjectsRepository.findById(subjectId);

      // Nếu có yêu cầu ngôn ngữ, áp dụng bản dịch
      if (lang) {
        await this.applyTranslation(subject, lang);
      }

      return subject;
    } catch (error) {
      throw new Error(
        `Error finding subject with ID ${subjectId}: ${error.message}`,
      );
    }
  }

  async findByCode(subjectCode: string, lang?: string) {
    try {
      const subject = await this.subjectsRepository.findByCode(subjectCode);

      // Nếu có yêu cầu ngôn ngữ, áp dụng bản dịch
      if (lang) {
        await this.applyTranslation(subject, lang);
      }

      return subject;
    } catch (error) {
      throw new Error(
        `Error finding subject with code ${subjectCode}: ${error.message}`,
      );
    }
  }

  async update(subjectId: string, data: UpdateSubjectDTO) {
    try {
      const subject = await this.subjectsRepository.findById(subjectId);
      const studentClassEnrolls =
        await this.studentClassEnrollRepository.findBySubjectCode(subject.code);

      // Kiểm tra điều kiện hiện có
      if (subject.credit !== data.credit && studentClassEnrolls.length > 0) {
        throw new Error(
          `Cannot update credit of subject with ID ${subjectId} because it has student class enrollments`,
        );
      }

      // Cập nhật subject
      const updatedSubject = await this.subjectsRepository.update(
        subjectId,
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
                  'Subject',
                  subjectId,
                  field,
                );

              if (translations.length > 0) {
                this.logger.log(
                  `Deleting existing translations for subject ${subjectId}, field ${field}`,
                );

                // Xóa từng bản dịch của trường này
                await this.translationService[
                  'translationRepository'
                ].deleteMany('Subject', subjectId);
              }
            } catch (deleteError) {
              this.logger.error(
                `Failed to delete old translations for field ${field}: ${deleteError.message}`,
              );
            }
          }

          // Tạo các bản dịch mới sau khi đã xóa bản dịch cũ
          await this.translationService.translateAndSave({
            entity: 'Subject',
            entityId: subjectId,
            fields: fieldsToTranslate,
          });
          this.logger.log(`Updated translations for subject ${subjectId}`);
        } catch (translationError) {
          this.logger.error(
            `Failed to update translations: ${translationError.message}`,
          );
          // Không fail update nếu dịch bị lỗi
        }
      }

      return updatedSubject;
    } catch (error) {
      throw new Error(
        `Error updating subject with ID ${subjectId}: ${error.message}`,
      );
    }
  }
  private async applyTranslation(
    subject: SubjectsDto & { faculty?: { id: string; title: string } },
    lang: string,
  ): Promise<void> {
    try {
      // 1. Áp dụng dịch thuật cho subject chính
      const translations = await this.translationService.getAllTranslations(
        'Subject',
        subject.id!,
        undefined,
        lang,
      );

      if (translations.length > 0) {
        // Áp dụng các bản dịch vào đối tượng subject
        for (const translation of translations) {
          subject[translation.field] = translation.value;
        }
      }

      // 2. Kiểm tra và dịch faculty
      if (subject.faculty && subject.faculty.id) {
        // Lấy bản dịch cho faculty
        this.logger.debug(
          `Getting translations for faculty ${subject.faculty.id}`,
        );
        const facultyTranslations =
          await this.translationService.getAllTranslations(
            'Faculty', // Tên entity trong database
            subject.faculty.id,
            undefined,
            lang,
          );

        this.logger.debug(
          `Found ${facultyTranslations.length} translations for faculty`,
        );

        // Áp dụng bản dịch vào faculty
        for (const translation of facultyTranslations) {
          if (translation.field === 'title' && subject.faculty.title) {
            subject.faculty.title = translation.value;
            this.logger.debug(
              `Applied faculty title translation: ${translation.value}`,
            );
          }
        }
      } else if (subject.facultyId) {
        // Trường hợp faculty được join dưới dạng khác
        this.logger.debug(
          `Getting translations for facultyId ${subject.facultyId}`,
        );
        const facultyTranslations =
          await this.translationService.getAllTranslations(
            'Faculty',
            subject.facultyId,
            undefined,
            lang,
          );

        // Kiểm tra và tạo đối tượng faculty nếu cần
        if (facultyTranslations.length > 0) {
          if (!subject.faculty) {
            // Tạo đối tượng faculty nếu chưa có
            subject.faculty = { id: subject.facultyId, title: '' };
          }

          // Tìm và áp dụng bản dịch tiêu đề
          const titleTranslation = facultyTranslations.find(
            (t) => t.field === 'title',
          );
          if (titleTranslation) {
            subject.faculty.title = titleTranslation.value;
            this.logger.debug(
              `Applied faculty title from facultyId: ${titleTranslation.value}`,
            );
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error applying translations: ${error.message}`);
    }
  }
  // Helper method để áp dụng bản dịch cho một danh sách subjects
  private async applyTranslationsToList(
    subjects: SubjectsDto[],
    lang: string,
  ): Promise<void> {
    for (const subject of subjects) {
      await this.applyTranslation(subject, lang);
    }
  }
}
