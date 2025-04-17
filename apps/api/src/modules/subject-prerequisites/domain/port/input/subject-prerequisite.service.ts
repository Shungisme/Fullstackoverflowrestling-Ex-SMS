import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubjectPrerequisiteDTO } from '../../dto/create-subject-prerequisite.dto';
import { UpdateSubjectPrerequisiteDTO } from '../../dto/update-subject-prerequisite.dto';
import {
  ISubjectPrerequisiteRepository,
  SUBJECT_PREREQUISITE_REPOSITORY,
} from '../output/ISubjectPrerequisiteRepository';
import { ISubjectPrerequisiteService } from './ISubjectPrerequisiteService';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { SubjectPrerequisiteResponseDto } from '../../dto/subject-prerequisite.dto';

@Injectable()
export class SubjectPrerequisiteService implements ISubjectPrerequisiteService {
  constructor(
    @Inject(SUBJECT_PREREQUISITE_REPOSITORY)
    private prerequisiteRepository: ISubjectPrerequisiteRepository,
  ) {}

  async count(whereOptions: any): Promise<number> {
    try {
      return await this.prerequisiteRepository.count(whereOptions);
    } catch (error) {
      throw new Error(`Error counting subject prerequisites: ${error.message}`);
    }
  }

  async create(
    prerequisite: CreateSubjectPrerequisiteDTO,
  ): Promise<SubjectPrerequisiteResponseDto> {
    try {
      // Check if the subject would be its own prerequisite
      if (prerequisite.subjectId === prerequisite.prerequisiteSubjectId) {
        throw new ConflictException(
          'A subject cannot be a prerequisite for itself',
        );
      }

      // Check if the prerequisite relationship already exists
      const exists = await this.prerequisiteRepository.exists(
        prerequisite.subjectId,
        prerequisite.prerequisiteSubjectId,
      );

      if (exists) {
        throw new ConflictException(
          'This prerequisite relationship already exists',
        );
      }

      return await this.prerequisiteRepository.create(prerequisite);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Error creating subject prerequisite: ${error.message}`);
    }
  }

  async delete(
    prerequisiteId: string,
  ): Promise<SubjectPrerequisiteResponseDto> {
    try {
      return await this.prerequisiteRepository.delete(prerequisiteId);
    } catch (error) {
      throw new Error(
        `Error deleting subject prerequisite with ID ${prerequisiteId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<SubjectPrerequisiteResponseDto>> {
    try {
      const prerequisites = await this.prerequisiteRepository.findAll(
        page,
        limit,
      );
      const total = await this.count({});

      return {
        data: prerequisites,
        page,
        totalPage: Math.ceil(total / limit),
        limit,
        total,
      };
    } catch (error) {
      throw new Error(
        `Error finding all subject prerequisites: ${error.message}`,
      );
    }
  }

  async findById(
    prerequisiteId: string,
  ): Promise<SubjectPrerequisiteResponseDto> {
    try {
      const prerequisite =
        await this.prerequisiteRepository.findById(prerequisiteId);
      if (!prerequisite) {
        throw new NotFoundException(
          `Subject prerequisite with ID ${prerequisiteId} not found`,
        );
      }
      return prerequisite;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error finding subject prerequisite with ID ${prerequisiteId}: ${error.message}`,
      );
    }
  }

  async findPrerequisitesForSubject(
    subjectId: string,
  ): Promise<SubjectPrerequisiteResponseDto[]> {
    try {
      return await this.prerequisiteRepository.findBySubjectId(subjectId);
    } catch (error) {
      throw new Error(
        `Error finding prerequisites for subject with ID ${subjectId}: ${error.message}`,
      );
    }
  }

  async findSubjectsRequiringPrerequisite(
    prerequisiteSubjectId: string,
  ): Promise<SubjectPrerequisiteResponseDto[]> {
    try {
      return await this.prerequisiteRepository.findByPrerequisiteSubjectId(
        prerequisiteSubjectId,
      );
    } catch (error) {
      throw new Error(
        `Error finding subjects that require prerequisite with ID ${prerequisiteSubjectId}: ${error.message}`,
      );
    }
  }

  async update(
    prerequisiteId: string,
    data: UpdateSubjectPrerequisiteDTO,
  ): Promise<SubjectPrerequisiteResponseDto> {
    try {
      // Check if the subject would be its own prerequisite
      if (
        data.subjectId &&
        data.prerequisiteSubjectId &&
        data.subjectId === data.prerequisiteSubjectId
      ) {
        throw new ConflictException(
          'A subject cannot be a prerequisite for itself',
        );
      }

      // If changing the relationship, check if it would create a duplicate
      if (data.subjectId && data.prerequisiteSubjectId) {
        const exists = await this.prerequisiteRepository.exists(
          data.subjectId,
          data.prerequisiteSubjectId,
        );

        if (exists) {
          throw new ConflictException(
            'This prerequisite relationship already exists',
          );
        }
      }

      const prerequisite =
        await this.prerequisiteRepository.findById(prerequisiteId);
      if (!prerequisite) {
        throw new NotFoundException(
          `Subject prerequisite with ID ${prerequisiteId} not found`,
        );
      }

      return await this.prerequisiteRepository.update(prerequisiteId, data);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Error updating subject prerequisite with ID ${prerequisiteId}: ${error.message}`,
      );
    }
  }
}
