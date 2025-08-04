const BASE_URL = "http://localhost:3000";
export const endpoint = {
  course: {
    v1: {
      getAll: `${BASE_URL}/courses`,
      getById: (id: string) => `/api/courses/${id}`,
      getUserCourses: (userId: string) => `/api/users/${userId}/courses`,
    },
  },
};
