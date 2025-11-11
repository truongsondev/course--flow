import type {
  ApiResponse,
  imageKitResponse,
  SignInResponse,
  SignUpResponse,
  tokenResponse,
  TTLResponse,
} from "@/dto/response/auth.response.dto";
import { endpoint } from "../constants/shared.constant";
import { EndpointService } from "./endpoint.service";
import type { authRequest } from "@/dto/request/auth.request.dto";
import { CommonService } from "./common.service";
import { toast } from "sonner";
class AuthenService {
  private static instance: AuthenService;

  //singleton pattern
  public static getInstance(): AuthenService {
    if (!AuthenService.instance) {
      AuthenService.instance = new AuthenService();
    }
    return AuthenService.instance;
  }

  public async login(data: authRequest) {
    const endpointService = EndpointService.getInstance();
    const url = endpoint.auth.v1.signin;
    return await endpointService.postEndpoint<ApiResponse<SignInResponse>>(
      url,
      data
    );
  }

  public async register(data: authRequest) {
    const endpointService = EndpointService.getInstance();
    const url = endpoint.auth.v1.signup;
    return await endpointService.postEndpoint<ApiResponse<SignUpResponse>>(
      url,
      data
    );
  }

  public async verifyOtp(data: { email: string; otp: string }) {
    const endpointService = EndpointService.getInstance();
    const url = endpoint.auth.v1.verifyOtp;
    return await endpointService.postEndpoint(url, data);
  }

  public async getTTL(emailToken: string) {
    const endpointService = EndpointService.getInstance();
    const url = `${endpoint.auth.v1.getTtl}?emailToken=${emailToken}`;
    console.log(url);
    return await endpointService.getEndpoint<ApiResponse<TTLResponse>>(url);
  }

  public async getSignedUrl() {
    const endpointService = EndpointService.getInstance();
    const url = endpoint.auth.v1.getSignatureUrl;
    return await endpointService.getEndpoint<ApiResponse<imageKitResponse>>(
      url
    );
  }

  public async checkRole(userId: string) {
    const endpointService = EndpointService.getInstance();
    const url = endpoint.auth.v1.checkRole;
    return await endpointService.postEndpoint<ApiResponse<string>>(url, {
      userId,
    });
  }

  public async refreshToken() {
    try {
      const token =
        CommonService.getInstance().getTokenFromLocalStorage("refreshToken");
      if (!token) {
        toast.error("Invalid user session. Please log in again.");
        return null;
      }
      const endpointService = EndpointService.getInstance();
      const url = endpoint.auth.v1.refreshToken;

      const res = await endpointService.postEndpoint<
        ApiResponse<tokenResponse>
      >(url, {
        refreshToken: token,
      });
      if (res.data.success) {
        const accessToken = res.data.data.accessToken;
        const refreshToken = res.data.data.refreshToken;
        CommonService.getInstance().saveTokenToLocalStorage(
          "accessToken",
          accessToken
        );
        CommonService.getInstance().saveTokenToLocalStorage(
          "refreshToken",
          refreshToken
        );
        return accessToken;
      }
    } catch (error) {
      toast.error("Session refresh failed. Please log in again.");
      return null;
    }
  }
}

const authenService = AuthenService.getInstance();
export default authenService;
