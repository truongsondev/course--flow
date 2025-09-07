import { createBrowserRouter } from "react-router";
import LoginPage from "@/pages/auth/login.tsx";
import RegisterPage from "@/pages/auth/register.tsx";
import OtpPage from "@/pages/auth/otp.tsx";
import Layout from "@/components/layout/layout.tsx";

import FacebookStyleProfile from "@/pages/user/user-infor";
import MyCoursesPage from "@/pages/main/my-course";
import HomePage from "@/pages/main/home";
import AdminPage from "@/pages/admin/admin";
import LayoutAdmin from "@/components/layout/admin/index.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {},
      {
        path: "my-courses",
        element: <MyCoursesPage />,
      },
    ],
  },
  {
    path: "/user",
    element: <FacebookStyleProfile />,
  },
  {
    path: "auth",
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "verify-otp",
        element: <OtpPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
    ],
  },
]);

export default router;
