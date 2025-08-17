import { endpoint } from "../constants/shared.constant";
import { EndpointService } from "./endpoint.service";
class AuthenService {
  private static instance: AuthenService;

  //singleton pattern
  public static getInstance(): AuthenService {
    if (!AuthenService.instance) {
      AuthenService.instance = new AuthenService();
    }
    return AuthenService.instance;
  }

  public async login(data: { email: string; password: string }) {
    const endpointService = EndpointService.getInstance();
    const url = endpoint.auth.v1.signup;
    return await endpointService.postEndpoint(url, data);
  }

  public async verifyOtp(data: { email: string; otp: string }) {
    const endpointService = EndpointService.getInstance();
    const url = endpoint.auth.v1.verifyOtp;
    return await endpointService.postEndpoint(url, data);
  }
}

const authenService = AuthenService.getInstance();
export default authenService;
