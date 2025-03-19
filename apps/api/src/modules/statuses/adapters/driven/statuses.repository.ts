import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { IStatusesRepository } from '../../domain/port/output/IStatusesRepository';
import { StatusesDto } from '../../domain/dto/statuses.dto';
import { CreateStatusDTO } from '../../domain/dto/create-status.dto';

@Injectable()
export class StatusesRepository implements IStatusesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async count(): Promise<number> {
    return await this.prismaService.statuses.count();
  }

  async create(status: CreateStatusDTO): Promise<StatusesDto> {
    const createdStatus = await this.prismaService.statuses.create({
      data: status,
    });
    return {
      ...createdStatus,
      status: createdStatus.status as 'active' | 'inactive',
    };
  }

  async delete(statusId: string): Promise<StatusesDto> {
    const deletedStatus = await this.prismaService.statuses.delete({
      where: { id: statusId },
    });
    return {
      ...deletedStatus,
      status: deletedStatus.status as 'active' | 'inactive',
    };
  }

  async findAll(page: number, limit: number): Promise<StatusesDto[]> {
    const statuses = await this.prismaService.statuses.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return statuses.map((status) => ({
      ...status,
      status: status.status as 'active' | 'inactive',
    }));
  }

  async findById(statusId: string): Promise<StatusesDto> {
    const status = await this.prismaService.statuses.findUnique({
      where: { id: statusId },
    });

    if (!status) {
      throw new Error(`Status with ID ${statusId} not found`);
    }

    return {
      ...status,
      status: status.status as 'active' | 'inactive',
    };
  }

  async update(statusId: string, data: CreateStatusDTO): Promise<StatusesDto> {
    const updatedStatus = await this.prismaService.statuses.update({
      where: { id: statusId },
      data,
    });

    return {
      ...updatedStatus,
      status: updatedStatus.status as 'active' | 'inactive',
    };
  }
}
