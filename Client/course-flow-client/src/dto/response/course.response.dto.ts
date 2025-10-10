import type { sessionDTO } from "../request/session.request.dto";

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
  videoUrl: string;
  thumbnailUrl: string;
  requirements?: string[];
  sessions: sessionDTO[];
  status: "published" | "paused" | "draft";
  avgRating: number;
  category: CategoriesResponse;
  createdAt: string;
}

export interface CourseEditReponse {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  videoUrl: string;
  requirements?: string[];
  sessions: sessionDTO[];
  status: "published" | "paused" | "draft";
  category: CategoriesResponse;
}

export interface CategoriesResponse {
  id: string;
  name: string;
}
