export interface ChatInfor {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  sentAt: Date | string;
  full_name?: string;
  avt_url?: string;
}
