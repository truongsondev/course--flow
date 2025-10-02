const BASE_URL = "http://localhost:3000/api/v1";
export const endpoint = {
  course: {
    v1: {
      getAll: `${BASE_URL}/courses`,
      getById: (id: string) => `/api/courses/${id}`,
      getUserCourses: (userId: string) => `/api/users/${userId}/courses`,
      getAllCategories: `${BASE_URL}/categories`,
    },
  },
  auth: {
    v1: {
      signup: `${BASE_URL}/auth/signup`,
      signin: `${BASE_URL}/auth/signin`,
      verifyOtp: `${BASE_URL}/auth/verify-otp`,
      getTtl: `${BASE_URL}/auth/get-ttl`,
    },
  },
};
