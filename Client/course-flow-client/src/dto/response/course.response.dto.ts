import type { sessionDTO } from "../request/session.request.dto";

export interface CourseHomeResponse {
  id: number;
  title: string;
  thumbnailUrl: string;
  price: number;
  status: string;
  category: string;
  avgRating: number;
  students: number;
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

export interface LessonDetail {
  id: string;
  title: string;
  duration: number;
  videoUrl?: string;
  docUrl?: string;
}

export interface SessionDetail {
  id: string;
  title: string;
  position: number;
  lessons: LessonDetail[];
}

export interface CourseDetailResponse {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  thumbnailUrl: string;
  videoUrl: string;
  price: number;
  requirements: string[];
  avgRating: number;
  studentCount: number;
  totalDuration: number;
  sessions: SessionDetail[];
}
