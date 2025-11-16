import { endpoint } from "@/constants/shared.constant";
import { EndpointService } from "./endpoint.service";
import type { ApiResponse } from "@/dto/response/auth.response.dto";
import type { ChatInfor } from "@/dto/response/chat.response.dto";

class ChatService {
  private static instanceCloudService: ChatService;
  public static getInstanceCloudService() {
    if (!ChatService.instanceCloudService) {
      ChatService.instanceCloudService = new ChatService();
    }
    return ChatService.instanceCloudService;
  }

  public getAllChatInfor(userId: string) {
    const endpointService = EndpointService.getInstance();

    let url = `${endpoint.chat.v1.getAllChatInfor}/${encodeURIComponent(
      userId
    )}`;

    return endpointService.getEndpoint<ApiResponse<ChatInfor[]>>(url);
  }

  public getAllMessage(userId: string, instructorId: string) {
    const endpointService = EndpointService.getInstance();

    let url = `${endpoint.chat.v1.getMessage}/${encodeURIComponent(
      userId
    )}/${instructorId}`;

    return endpointService.getEndpoint<ApiResponse<ChatInfor[]>>(url);
  }
}
const chatService = ChatService.getInstanceCloudService();
export default chatService;
