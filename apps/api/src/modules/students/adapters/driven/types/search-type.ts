export class SearchStudent {
  key?: string;
  limit: number;
  page: number;
  faculty?: string;

  constructor(data: SearchStudent) {
    this.faculty = data?.faculty;
    this.key = data?.key;
    this.limit = data.limit;
    this.page = data.page;
  }
}
