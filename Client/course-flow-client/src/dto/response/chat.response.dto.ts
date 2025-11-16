export interface ChatInfor {
  id: string;
  fromUserId: string;
  message: string;
  sentAt: Date | string;
  full_name?: string;
  avt_url?: string;
}
