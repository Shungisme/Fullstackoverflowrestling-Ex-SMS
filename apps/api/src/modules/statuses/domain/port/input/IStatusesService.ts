import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { CreateStatusDTO } from '../../dto/create-status.dto';
import { StatusesDto } from '../../dto/statuses.dto';
import { UpdateStatusDTO } from '../../dto/update-status.dto';

export interface IStatusesService {
  create(status: CreateStatusDTO): Promise<StatusesDto>;

  update(statusId: string, data: UpdateStatusDTO): Promise<StatusesDto>;

  delete(statusId: string): Promise<StatusesDto>;

  findById(statusId: string, lang?: string): Promise<StatusesDto>;

  findAll(
    page: number,
    limit: number,
    status: string,
    lang?: string,
  ): Promise<PaginatedResponse<StatusesDto>>;

  count(whereOptions: any): Promise<number>;
}
