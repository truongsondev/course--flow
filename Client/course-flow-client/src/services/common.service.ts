export class CommonService {
  static instance: CommonService;
  public static getInstance(): CommonService {
    if (!CommonService.instance) {
      CommonService.instance = new CommonService();
    }
    return CommonService.instance;
  }

  getTokenFromLocalStorage(token: string): string | null {
    return localStorage.getItem(token);
  }

  saveTokenToLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  clearTokensFromLocalStorage(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}
