import type { sessionRequestDto } from "./session.request.dto";

export interface courseRequestDto {
  title: string;
  description: string;
  category_id: number;
  price: number;
  thumbnail_url?: string;
  status: string;
  sessions: sessionRequestDto[];
  // quizzes: QuizRequestDto[];
}
