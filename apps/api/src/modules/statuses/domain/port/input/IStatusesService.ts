import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { CreateStatusDTO } from '../../dto/create-status.dto';
import { StatusesDto } from '../../dto/statuses.dto';

export interface IStatusesService {
  create(status: CreateStatusDTO): Promise<StatusesDto>;

  update(statusId: string, data: CreateStatusDTO): Promise<StatusesDto>;

  delete(statusId: string): Promise<StatusesDto>;

  findById(statusId: string): Promise<StatusesDto>;

  findAll(page: number, limit: number): Promise<PaginatedResponse<StatusesDto>>;

  count(): Promise<number>;
}
