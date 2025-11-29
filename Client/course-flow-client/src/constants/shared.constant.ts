export const BASE_URL = "http://localhost:3000/api/v1";
export const endpoint = {
  course: {
    v1: {
      getAll: `/courses`,
      getCourse: `/course/home`,
      getById: (id: string) => `/api/courses/${id}`,
      getUserCourses: (userId: string) => `/api/users/${userId}/courses`,
      getAllCategories: `/categories`,
      createCourse: `/create-course`,
      getEditCourse: `/course-for-edit`,
      editCourse: `/course-edit`,
      getCourseForDetail: `/course-detail`,
      getReviewForCourse: `/review`,
      getCourseForWatch: `/course-watch`,
      reviewCourse: `/review-course`,
      addNote: `/create-note`,
      markDoneLecture: `/mark-done-lecture`,
      searchCourse: `/search-courses`,
      getMyCourse: `/my-courses`,
      dashboard: "/dashboard",
    },
  },
  payment: {
    v1: {
      createPayment: `/payment/create`,
    },
  },
  auth: {
    v1: {
      signup: `/auth/signup`,
      signin: `/auth/signin`,
      verifyOtp: `/auth/verify-otp`,
      getTtl: `/auth/get-ttl`,
      getSignatureUrl: `/auth/get-signature`,
      checkRole: `/auth/check-role`,
      refreshToken: `/auth/refresh-token`,
      forget: `/auth/forget-password`,
      resetPssword: `/auth/reset-password`,
    },
  },
  user: {
    v1: {
      getProfile: `/profile`,
      updateProfile: `/update-profile`,
      checkRole: `/check-role`,
      getStudent: "/student",
      userChat: "/chat-user",
      becomeToInstructor: "/become-intructor",
    },
  },
  chat: {
    v1: {
      getAllChatInfor: `/chat-list`,
      getMessage: "/messages",
    },
  },
};
