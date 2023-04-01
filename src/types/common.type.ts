export interface SelectValue {
  key: string;
  value: any;
}

export interface CommonListResponse<T> {
  list: T[];
  page: number;
  perPage: number;
  total: number;
}

export interface CommonResponse<T> {
  data: T | null;
  status: number;
  message: string;
  isSuccess: boolean;
  validateError?: object;
}
