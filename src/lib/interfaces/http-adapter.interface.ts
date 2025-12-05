import { AxiosRequestConfig } from 'axios';

export interface HttpAdapter {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}
