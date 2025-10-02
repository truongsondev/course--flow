import { ProfilePage } from "@/components/instructor/profile-page";
import { Topbar } from "@/components/instructor/topbar";
import { Sidebar } from "@/components/instructor/sidebar";
import React, { useState } from "react";

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
import type { CourseInstructorResponse } from "@/dto/response/course.response.dto";
const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Nguyễn An",
    email: "an@example.com",
    enrolled: ["React Masterclass"],
  },
  {
    id: "s2",
    name: "Trần Bình",
    email: "binh@example.com",
    enrolled: ["React Masterclass", "NodeJS Pro"],
  },
  {
    id: "s3",
    name: "Lê Hoa",
    email: "hoa@example.com",
    enrolled: ["TypeScript Deep Dive"],
  },
];

type Student = {
  id: string;
  name: string;
  email: string;
  enrolled: string[];
  avatar?: string;
};

type Stats = {
  revenueByMonth: { month: string; revenue: number; students: number }[];
  topCourses: { name: string; students: number }[];
  totalStudents: number;
  totalRevenue: number;
  totalCourses: number;
  totalOrders: number;
};

const mockCourses: CourseInstructorResponse[] = [
  {
    id: "c1",
    title: "React Masterclass",
    price: 29.99,
    students: 420,
    sessions: [
      {
        title: "Introduction",
        position: 1,
        lessons: [
          {
            title: "Welcome to the Course",
            position: 1,
            video_url: "https://example.com/intro.mp4",
          },
          {
            title: "Setup & Installation",
            position: 2,
            pdf_url: "https://example.com/setup.pdf",
          },
        ],
      },
      {
        title: "Advanced Topics",
        position: 2,
        lessons: [
          {
            title: "Hooks Deep Dive",
            position: 1,
            video_url: "https://example.com/hooks.mp4",
          },
          {
            title: "Performance Optimization",
            position: 2,
            video_url: "https://example.com/perf.mp4",
          },
        ],
      },
    ],
    rating: 4.8,
    status: "published",
    createdAt: "2025-09-19T10:00:00Z",
    thumbnail_url: "https://placehold.co/600x400/react.png",
  },
  {
    id: "c2",
    title: "NodeJS Pro",
    price: 19.99,
    students: 210,
    sessions: [
      {
        title: "Getting Started",
        position: 1,
        lessons: [
          {
            title: "Node Basics",
            position: 1,
            video_url: "https://example.com/node-basics.mp4",
          },
          {
            title: "NPM & Packages",
            position: 2,
            pdf_url: "https://example.com/npm.pdf",
          },
        ],
      },
    ],
    rating: 4.5,
    status: "published",
    createdAt: "2025-09-10T15:30:00Z",
    thumbnail_url: "https://placehold.co/600x400/node.png",
  },
  {
    id: "c3",
    title: "TypeScript Deep Dive",
    price: 24.99,
    students: 160,
    sessions: [
      {
        title: "Type Basics",
        position: 1,
        lessons: [
          {
            title: "Primitive Types",
            position: 1,
            video_url: "https://example.com/types.mp4",
          },
          {
            title: "Interfaces & Types",
            position: 2,
            pdf_url: "https://example.com/interfaces.pdf",
          },
        ],
      },
      {
        title: "Generics",
        position: 2,
        lessons: [
          {
            title: "Generic Functions",
            position: 1,
            video_url: "https://example.com/generics.mp4",
          },
        ],
      },
    ],
    rating: 4.2,
    status: "paused",
    createdAt: "2025-08-25T09:00:00Z",
    thumbnail_url: "https://placehold.co/600x400/ts.png",
  },
  {
    id: "c4",
    title: "Next.js Zero to Hero",
    price: 34.99,
    students: 95,
    sessions: [
      {
        title: "Getting Started",
        position: 1,
        lessons: [
          {
            title: "Why Next.js?",
            position: 1,
            video_url: "https://example.com/why-next.mp4",
          },
          {
            title: "Setup Project",
            position: 2,
            pdf_url: "https://example.com/setup-next.pdf",
          },
        ],
      },
    ],
    rating: 4.7,
    status: "draft",
    createdAt: "2025-09-01T11:00:00Z",
    thumbnail_url: "https://placehold.co/600x400/next.png",
  },
];

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

const StudentsPage: React.FC<{ students: Student[] }> = ({ students }) => {
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
                <TableHead>Enrolled</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.enrolled.join(", ")}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                      <Button size="sm">Message</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default function InstructorDashboard() {
  const [active, setActive] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false); // reserved if mobile

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar active={active} setActive={setActive} />

      <div className="flex-1 p-8">
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="mt-6">
          {active === "dashboard" && <DashboardPage stats={mockStats} />}
          {active === "courses" && <CoursesPage courses={mockCourses} />}
          {active === "students" && <StudentsPage students={mockStudents} />}
          {active === "analytics" && <DashboardPage stats={mockStats} />}
          {active === "settings" && <ProfilePage />}
        </div>
      </div>
    </div>
  );
}
