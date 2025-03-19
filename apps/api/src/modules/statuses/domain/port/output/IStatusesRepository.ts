import { CreateStatusDTO } from '../../dto/create-status.dto';
import { StatusesDto } from '../../dto/statuses.dto';

export interface IStatusesRepository {
  create(status: CreateStatusDTO): Promise<StatusesDto>;

  update(statusId: string, data: CreateStatusDTO): Promise<StatusesDto>;

  delete(statusId: string): Promise<StatusesDto>;

  findById(statusId: string): Promise<StatusesDto>;

  findAll(page: number, limit: number): Promise<StatusesDto[]>;

  count(): Promise<number>;
}
