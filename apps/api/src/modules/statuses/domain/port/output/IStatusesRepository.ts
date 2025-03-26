import { CreateStatusDTO } from '../../dto/create-status.dto';
import { StatusesDto } from '../../dto/statuses.dto';
import { UpdateStatusDTO } from '../../dto/update-status.dto';

export interface IStatusesRepository {
  create(status: CreateStatusDTO): Promise<StatusesDto>;

  update(statusId: string, data: UpdateStatusDTO): Promise<StatusesDto>;

  delete(statusId: string): Promise<StatusesDto>;

  findById(statusId: string): Promise<StatusesDto>;

  findByName(statusName: string): Promise<StatusesDto>;

  findAll(page: number, limit: number): Promise<StatusesDto[]>;

  count(): Promise<number>;
}

export const STATUS_REPOSITORY = Symbol('IStatusesRepository');
