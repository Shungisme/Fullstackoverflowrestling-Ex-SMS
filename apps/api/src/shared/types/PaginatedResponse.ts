export class PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPage: number;
  page: number;
  limit: number;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.totalPage = Math.ceil(total / limit);
    this.page = page;
    this.limit = limit;
  }
}
