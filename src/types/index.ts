export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
