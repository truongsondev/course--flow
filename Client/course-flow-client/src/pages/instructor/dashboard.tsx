import { StatCard } from "@/components/instructor/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Activity, BookOpen, DollarSign, Users } from "lucide-react";

type DashboardStats = {
  totalCourses: number;
  totalStudents: number;
  totalOrders: number;
  totalRevenue: number;
};

type CoursePerformance = {
  id: string;
  title: string;
  studentCount: number;
  avgRating: number;
  completionRate: number;
};

type DashboardActivity = {
  id: string;
  text: string;
  time: string;
};

export function DashboardPage({
  stats,
  performance,
  activity,
}: {
  stats: DashboardStats;
  performance: CoursePerformance[];
  activity: DashboardActivity[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users size={18} />}
          delta="+3.4%"
        />

        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={18} />}
          delta="+1.2%"
        />

        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={<BookOpen size={18} />}
          delta="+0.5%"
        />

        <StatCard
          title="Orders"
          value={stats.totalOrders}
          icon={<Activity size={18} />}
          delta="-0.8%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle>Revenue & Students (last 6 months)</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-sm text-gray-400 py-10 text-center">
              Chart will be displayed here...
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Course Performance</CardTitle>
            </CardHeader>

            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500">
                    <th className="text-left py-2">Course</th>
                    <th className="text-left py-2">Students</th>
                    <th className="text-left py-2">Rating</th>
                    <th className="text-left py-2">Completion</th>
                  </tr>
                </thead>

                <tbody>
                  {performance.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="py-2 font-medium">{c.title}</td>
                      <td>{c.studentCount}</td>
                      <td>{c.avgRating.toFixed(1)}</td>
                      <td>{c.completionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {performance.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No course data available.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {activity.map((a) => (
                <div key={a.id} className="text-sm text-gray-700">
                  {a.text}
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(a.time).toLocaleString()}
                  </span>
                </div>
              ))}

              {activity.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No recent activity.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
