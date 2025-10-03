import {
  IsString,
  IsNumber,
  Min,
  IsEnum,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
  MinLength,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SessionDto } from './session.request.dto';

export enum CourseStatus {
  Draft = 'draft',
  Published = 'published',
  Paused = 'paused',
}

export class CreateCourseDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @Min(1)
  category_id: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  thumbnailUrl: string;

  @IsString()
  videoUrl: string;

  @IsEnum(CourseStatus)
  status: CourseStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @ValidateNested({ each: true })
  @Type(() => SessionDto)
  @ArrayMinSize(1)
  sessions: SessionDto[];
}
