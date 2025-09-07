export interface CourseHomeResponse {
  course_id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  price: number;
  language: string;
  level: string;
  created_at: Date;
  updated_at: Date;
  user_id: number;
  name: string;
  avg_rating: number;
  tags: string[];
}
