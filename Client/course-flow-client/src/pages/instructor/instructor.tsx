import { ProfilePage } from "@/components/instructor/profile-page";
import { Topbar } from "@/components/instructor/topbar";
import { Sidebar } from "@/components/instructor/sidebar";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DashboardPage } from "./dashboard";
import { CoursesPage } from "./course-page";
import type {
  CourseInstructorResponse,
  DashboardResponse,
} from "@/dto/response/course.response.dto";
import courseService from "@/services/course.service";
import { toast } from "sonner";
import authenService from "@/services/authen.service";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router";
import type { StudentReponse } from "@/dto/response/user.response.dto";
import userService from "@/services/user.service";
import ChatWindow from "@/chat/chat-windown";

type Stats = {
  revenueByMonth: { month: string; revenue: number; students: number }[];
  topCourses: { name: string; students: number }[];
  totalStudents: number;
  totalRevenue: number;
  totalCourses: number;
  totalOrders: number;
};

const mockStats: Stats = {
  revenueByMonth: [
    { month: "Jan", revenue: 1200, students: 80 },
    { month: "Feb", revenue: 1800, students: 120 },
    { month: "Mar", revenue: 2400, students: 160 },
    { month: "Apr", revenue: 2000, students: 130 },
    { month: "May", revenue: 3000, students: 200 },
    { month: "Jun", revenue: 3500, students: 240 },
  ],
  topCourses: [
    { name: "React Masterclass", students: 420 },
    { name: "NodeJS Pro", students: 210 },
    { name: "TypeScript Deep Dive", students: 160 },
  ],
  totalStudents: 790,
  totalRevenue: 11540,
  totalCourses: 12,
  totalOrders: 980,
};

const StudentsPage: React.FC<{ students: StudentReponse[] }> = ({
  students,
}) => {
  const [openChat, setOpenChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Students</h3>
        <Button>+ Invite Student</Button>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>All students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.full_name || "Updating"}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                      <Button
                        onClick={() => {
                          setOpenChat(true);
                          setSelectedUser(s.id);
                        }}
                        size="sm"
                      >
                        Message
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {openChat && (
        <div className="fixed bottom-4 right-4 z-[9999]">
          <ChatWindow
            userId={selectedUser}
            onClose={() => setOpenChat(false)}
          />
        </div>
      )}
    </div>
  );
};

export default function InstructorDashboard() {
  const [active, setActive] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState<StudentReponse[]>([]);
  const [dashboard, setDashboard] = useState<DashboardResponse>();
  const navigation = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseInstructorResponse[]>([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await courseService.getCourseListForInstructor(
          user?.id || ""
        );
        if (result.data.success && result.data.data) {
          setCourses(result.data.data);
        }
      } catch (error) {
        toast.error("Access denied.");
        navigation("/");
      }
    };

    const fetchStudents = async () => {
      try {
        const result = await userService.getUserForInstructor(user?.id || "");
        setStudents(result.data.data);
      } catch (error) {
        toast.error("Fail to fetch student");
      }
    };

    const fetchDataDashboard = async () => {
      try {
        const res = await courseService.getDataForDashboard(user?.id || "");
        setDashboard(res.data.data);
      } catch (err) {}
    };

    const fetchData = async () => {
      await Promise.all([
        fetchCourses(),
        fetchStudents(),
        fetchDataDashboard(),
      ]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkRole = async () => {
      const res = await authenService.checkRole(user?.id || "");
      if (res.data.data !== "instructor") {
        toast.warning("Access denied.");
        navigation("/");
        return;
      }
    };
    // checkRole();
  });
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar active={active} setActive={setActive} />

      <div className="flex-1 p-8">
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="mt-6">
          {active === "dashboard" && (
            <DashboardPage
              stats={
                dashboard?.stats || {
                  totalCourses: courses.length,
                  totalRevenue: 0,
                  totalOrders: 0,
                  totalStudents: students.length,
                }
              }
              performance={dashboard?.performance || []}
              activity={dashboard?.activity || []}
            />
          )}
          {active === "courses" && <CoursesPage courses={courses} />}
          {active === "students" && <StudentsPage students={students} />}
          {active === "settings" && <ProfilePage />}
        </div>
      </div>
    </div>
  );
}
