import { createBrowserRouter } from "react-router";
import LoginPage from "@/pages/auth/login.tsx";
import RegisterPage from "@/pages/auth/register.tsx";
import OtpPage from "@/pages/auth/otp.tsx";
import Layout from "@/components/layout/layout.tsx";
import Courses from "@/pages/main/courses";
import CourseDetail from "@/pages/main/course-detail";
import CourseWatch from "@/pages/main/cours-watch";
import CheckoutPage from "@/pages/main/payment";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "courses",
        children: [
          {
            index: true,
            element: <Courses />,
          },
          {
            path: ":courseId",
            element: <CourseDetail />,
          },
          {
            path: ":courseId/lessons/:lessonId",
            element: <CourseWatch />,
          },
          {
            path: "payment",
            element: <CheckoutPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/verify-otp",
    element: <OtpPage />,
  },
]);

export default router;
