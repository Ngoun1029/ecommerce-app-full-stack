export type ApiResponse<T = unknown, Y = unknown> = {
  status: string;
  message: string;
  data?: T;
  meta?: Y;
};