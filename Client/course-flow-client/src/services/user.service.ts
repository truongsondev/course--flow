// import type { ApiResponse } from "@/dto/response/auth.response.dto";
// import { endpoint } from "../constants/shared.constant";
// import { EndpointService } from "./endpoint.service";
// import type {
//   CategoriesResponse,
//   CourseDetailResponse,
//   CourseEditReponse,
//   CourseHomeResponse,
//   CourseInstructorResponse,
//   CourseWatchResponse,
// } from "@/dto/response/course.response.dto";
// class UserService {
//   private static instance: UserService;

//   //singleton pattern
//   public static getInstance(): UserService {
//     if (!UserService.instance) {
//       UserService.instance = new UserService();
//     }

//     return UserService.instance;
//   }

//   public getAll() {
//     const endpointService = EndpointService.getInstance();

//     return endpointService.putEndpoint<ApiResponse<any>>("", "");
//   }
// }

// const userService = UserService.getInstance();
// export default userService;

import axios from "axios";
type Instructor = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  expertise: string;
  status: "pending" | "approved" | "rejected";
  avatarUrl?: string;
};
const instructorService = {
  getAll: async () => {
    // Dữ liệu demo (thay bằng API thật)
    let data: Instructor[] = [
      {
        id: "1",
        fullName: "Nguyễn Văn A",
        email: "a@example.com",
        phone: "0901234567",
        expertise: "IELTS Writing",
        status: "pending",
      },
      {
        id: "2",
        fullName: "Trần Thị B",
        email: "b@example.com",
        phone: "0907654321",
        expertise: "IELTS Speaking",
        status: "approved",
      },
      {
        id: "3",
        fullName: "Lê Văn C",
        email: "c@example.com",
        phone: "0912345678",
        expertise: "TOEIC Reading",
        status: "rejected",
      },
    ];

    return data;
  },

  approve: async (id: string) => {
    // return axios.patch(`/api/instructors/${id}/approve`);
    return true;
  },

  reject: async (id: string) => {
    // return axios.patch(`/api/instructors/${id}/reject`);
    return true;
  },
};

export default instructorService;
