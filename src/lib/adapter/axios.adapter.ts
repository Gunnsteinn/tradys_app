import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class AxiosAdapter {
  private axios: AxiosInstance = axios;

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url, config);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(
    url: string,
    body?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const { data } = await this.axios.post<T>(url, body, config);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
