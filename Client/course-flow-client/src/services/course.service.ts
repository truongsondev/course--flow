import type { ApiResponse } from "@/dto/response/auth.response.dto";
import { endpoint } from "../constants/shared.constant";
import { EndpointService } from "./endpoint.service";
import type {
  CategoriesResponse,
  CourseDetailResponse,
  CourseEditReponse,
  CourseHomeResponse,
  CourseInstructorResponse,
  CourseWatchResponse,
} from "@/dto/response/course.response.dto";
class CourseService {
  private static instance: CourseService;

  //singleton pattern
  public static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService();
    }

    return CourseService.instance;
  }

  /** get API for all course */
  public getCourseListForInstructor() {
    const endpointService = EndpointService.getInstance();
    const url = endpoint.course.v1.getAll;
    return endpointService.getEndpoint<ApiResponse<CourseInstructorResponse[]>>(
      url
    );
  }

  public getCourseForHome(limit: number) {
    const endpointService = EndpointService.getInstance();
    const url = endpoint.course.v1.getCourseForHome + "/" + limit;

    return endpointService.getEndpoint<ApiResponse<CourseHomeResponse[]>>(url);
  }

  public getCourseForDetail(courseId: string, userId: string) {
    const endpointService = EndpointService.getInstance();
    const url =
      endpoint.course.v1.getCourseForDetail + "/" + courseId + "/" + userId;

    return endpointService.getEndpoint<
      ApiResponse<CourseDetailResponse | null>
    >(url);
  }

  public getCourseForWatch(courseId: string, userId: string) {
    const endpointService = EndpointService.getInstance();
    const url =
      endpoint.course.v1.getCourseForWatch + "/" + courseId + "/" + userId;

    return endpointService.getEndpoint<ApiResponse<CourseWatchResponse | null>>(
      url
    );
  }

  public getAllCategories() {
    const endpointService = EndpointService.getInstance();
    const url = endpoint.course.v1.getAllCategories;
    return endpointService.getEndpoint<ApiResponse<CategoriesResponse[]>>(url);
  }

  public createCourse(data: any) {
    const endpointService = EndpointService.getInstance();
    const url = endpoint.course.v1.createCourse;
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    return endpointService.postEndpoint<ApiResponse<any>>(url, data, config);
  }

  public getCourseForEdit(courseId: string) {
    const endpointService = EndpointService.getInstance();
    const url = `${endpoint.course.v1.getEditCourse}/${courseId}`;
    return endpointService.getEndpoint<ApiResponse<CourseEditReponse>>(url);
  }

  public editCourse(course: any) {
    const endpointService = EndpointService.getInstance();
    const url = `${endpoint.course.v1.editCourse}`;
    return endpointService.putEndpoint<ApiResponse<CourseEditReponse>>(
      url,
      course
    );
  }
}

const courseService = CourseService.getInstance();
export default courseService;
