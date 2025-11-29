import axios, { type AxiosInstance } from "axios";
import { toast } from "sonner";
import { CommonService } from "./common.service";
import authenService from "./authen.service";
import { BASE_URL } from "@/constants/shared.constant";

export class EndpointService {
  private static instance: EndpointService;
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  private commonService = CommonService.getInstance();

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      headers: { "Content-Type": "application/json" },
    });

    this.axiosInstance.interceptors.request.use((config) => {
      const token = this.commonService.getTokenFromLocalStorage("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        console.log("Error response:", error);
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !this.isRefreshing
        ) {
          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newAccessToken = await authenService.refreshToken();
            this.isRefreshing = false;
            this.onRefreshed(newAccessToken || "");

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.axiosInstance(originalRequest);
          } catch (err) {
            this.isRefreshing = false;
            this.commonService.clearTokensFromLocalStorage();
            toast.error("Session expried, please log in again.");
            window.location.href = "/auth/login";
            return Promise.reject(err);
          }
        }

        if (this.isRefreshing) {
          return new Promise((resolve) => {
            this.subscribeTokenRefresh((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(this.axiosInstance(originalRequest));
            });
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private subscribeTokenRefresh(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  public static getInstance(): EndpointService {
    if (!EndpointService.instance) {
      EndpointService.instance = new EndpointService();
    }
    return EndpointService.instance;
  }

  public getEndpoint<T>(url: string, option?: any) {
    return this.axiosInstance.get<T>(url, option);
  }

  public postEndpoint<T>(url: string, data: any, option?: any) {
    return this.axiosInstance.post<T>(url, data, option);
  }

  public putEndpoint<T>(url: string, data: any, option?: any) {
    return this.axiosInstance.put<T>(url, data, option);
  }

  public patchEndpoint<T>(url: string, data: any, option?: any) {
    return this.axiosInstance.patch<T>(url, data, option);
  }

  public deleteEndpoint<T>(url: string, option?: any) {
    return this.axiosInstance.delete<T>(url, option);
  }
}
