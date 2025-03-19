import { Inject, Injectable } from '@nestjs/common';
import { CreateStatusDTO } from '../../dto/create-status.dto';
import { UpdateStatusDTO } from '../../dto/update-status.dto';
import { IStatusesRepository } from '../output/IStatusesRepository';
import { IStatusesService } from './IStatusesService';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { StatusesDto } from '../../dto/statuses.dto';

@Injectable()
export class StatusesService implements IStatusesService {
  constructor(
    @Inject('IStatusesRepository')
    private statusesRepository: IStatusesRepository,
  ) {}

  async count(): Promise<number> {
    try {
      return await this.statusesRepository.count();
    } catch (error) {
      throw new Error(`Error counting statuses: ${error.message}`);
    }
  }

  async create(status: CreateStatusDTO) {
    try {
      return await this.statusesRepository.create(status);
    } catch (error) {
      throw new Error(`Error creating status: ${error.message}`);
    }
  }

  async delete(statusId: string) {
    try {
      return await this.statusesRepository.delete(statusId);
    } catch (error) {
      throw new Error(
        `Error deleting status with ID ${statusId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<StatusesDto>> {
    try {
      const statuses = await this.statusesRepository.findAll(page, limit);
      const totalStatuses = await this.statusesRepository.count();

      return {
        data: statuses,
        page,
        totalPage: Math.ceil(totalStatuses / limit),
        limit,
        total: totalStatuses,
      };
    } catch (error) {
      throw new Error(`Error finding all statuses: ${error.message}`);
    }
  }

  async findById(statusId: string) {
    try {
      return await this.statusesRepository.findById(statusId);
    } catch (error) {
      throw new Error(
        `Error finding status with ID ${statusId}: ${error.message}`,
      );
    }
  }

  async update(statusId: string, data: UpdateStatusDTO) {
    try {
      return await this.statusesRepository.update(statusId, data);
    } catch (error) {
      throw new Error(
        `Error updating status with ID ${statusId}: ${error.message}`,
      );
    }
  }
}
