export interface UserResponse {
  user_id: number;
  email: string;
  avt_url: string | null;
  bio: string | null;
  name: string | null;
  created_at: string; // hoặc Date nếu bạn parse thành Date object
  updated_at: string; // hoặc Date
  role_id: number;
  user_verified: boolean;
}
