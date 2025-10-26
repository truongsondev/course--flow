const BASE_URL = "http://localhost:3000/api/v1";
export const endpoint = {
  course: {
    v1: {
      getAll: `${BASE_URL}/courses`,
      getCourse: `${BASE_URL}/course/home`,
      getById: (id: string) => `/api/courses/${id}`,
      getUserCourses: (userId: string) => `/api/users/${userId}/courses`,
      getAllCategories: `${BASE_URL}/categories`,
      createCourse: `${BASE_URL}/create-course`,
      getEditCourse: `${BASE_URL}/course-for-edit`,
      editCourse: `${BASE_URL}/course-edit`,
      getCourseForDetail: `${BASE_URL}/course-detail`,
      getReviewForCourse: `${BASE_URL}/review`,
      getCourseForWatch: `${BASE_URL}/course-watch`,
    },
  },
  payment: {
    v1: {
      createPayment: `${BASE_URL}/payment/create`,
    },
  },
  auth: {
    v1: {
      signup: `${BASE_URL}/auth/signup`,
      signin: `${BASE_URL}/auth/signin`,
      verifyOtp: `${BASE_URL}/auth/verify-otp`,
      getTtl: `${BASE_URL}/auth/get-ttl`,
      getSignatureUrl: `${BASE_URL}/auth/get-signature`,
    },
  },
  cloud: {
    v1: {
      deleteFile: `${BASE_URL}/cloud/delete-file`,
    },
  },
};
