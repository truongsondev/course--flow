import type { LessonRequestDto } from "./lesson.request.dto";

export interface sessionRequestDto {
  title: string;
  position: number;
  lessons: LessonRequestDto[];
}
