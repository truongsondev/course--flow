import type { sessionRequestDto } from "../request/session.request.dto";

export interface CourseHomeResponse {
  course_id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  price: number;
  level: string;
  category: string;
  created_at: Date;
  updated_at: Date;
  avg_rating: number;
  tags: string[];
}

export interface CourseInstructorResponse {
  id: string;
  title: string;
  price: number;
  students: number;
  sessions: sessionRequestDto[];
  rating?: number;
  status: "published" | "paused" | "draft";
  createdAt: string;
  thumbnail_url?: string;
}

export interface CategoriesResponse {
  id: number;
  name: string;
}
