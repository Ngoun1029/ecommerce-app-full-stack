export type PaginatedResponse<T> = {
  data: any;
  items: T[];
  total: number;
  hasNextPage: boolean;
};
