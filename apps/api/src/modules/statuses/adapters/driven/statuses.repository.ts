import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { IStatusesRepository } from '../../domain/port/output/IStatusesRepository';
import { StatusesDto } from '../../domain/dto/statuses.dto';
import { CreateStatusDTO } from '../../domain/dto/create-status.dto';
import { UpdateStatusDTO } from '../../domain/dto/update-status.dto';

@Injectable()
export class StatusesRepository implements IStatusesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async count(whereOptions: any): Promise<number> {
    return await this.prismaService.status.count({
      where: whereOptions,
    });
  }

  async create(status: CreateStatusDTO): Promise<StatusesDto> {
    const createdStatus = await this.prismaService.status.create({
      data: status,
    });
    return {
      ...createdStatus,
      status: createdStatus.status as 'active' | 'inactive',
    };
  }

  async delete(statusId: string): Promise<StatusesDto> {
    const deletedStatus = await this.prismaService.status.delete({
      where: { id: statusId },
    });
    return {
      ...deletedStatus,
      status: deletedStatus.status as 'active' | 'inactive',
    };
  }

  async findAll(
    page: number,
    limit: number,
    status: string,
  ): Promise<StatusesDto[]> {
    const whereOptions = {
      status: status
        ? {
            equals: status as 'active' | 'inactive',
          }
        : undefined,
    };

    const statuses = await this.prismaService.status.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereOptions,
    });

    return statuses.map((status) => ({
      ...status,
      status: status.status as 'active' | 'inactive',
    }));
  }

  async findById(statusId: string): Promise<StatusesDto> {
    const status = await this.prismaService.status.findUnique({
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
  async findByName(statusName: string): Promise<StatusesDto> {
    const status = await this.prismaService.status.findFirstOrThrow({
      where: {
        title: {
          contains: statusName,
          mode: 'insensitive',
        },
      },
    });

    return {
      ...status,
      status: status.status as 'active' | 'inactive',
    };
  }

  async update(statusId: string, data: UpdateStatusDTO): Promise<StatusesDto> {
    const updatedStatus = await this.prismaService.status.update({
      where: { id: statusId },
      data,
    });

    return {
      ...updatedStatus,
      status: updatedStatus.status as 'active' | 'inactive',
    };
  }
}
