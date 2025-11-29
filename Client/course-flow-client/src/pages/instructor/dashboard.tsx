import { StatCard } from "@/components/instructor/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
  chart,
}: {
  stats: DashboardStats;
  performance: CoursePerformance[];
  activity: DashboardActivity[];
  chart: { month: string; revenue: number; students: number }[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users size={18} />}
        />

        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={18} />}
        />

        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={<BookOpen size={18} />}
        />

        <StatCard
          title="Orders"
          value={stats.totalOrders}
          icon={<Activity size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle>Revenue & Students (last 6 months)</CardTitle>
          </CardHeader>

          <CardContent>
            {chart.length === 0 ? (
              <p className="text-sm text-gray-500 py-10 text-center">
                No chart data available.
              </p>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chart}
                    margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* Month */}
                    <XAxis dataKey="month" />

                    {/* Values */}
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />

                    <Tooltip />
                    <Legend />

                    {/* Revenue (bar) */}
                    <Bar
                      yAxisId="left"
                      dataKey="revenue"
                      fill="#4f46e5"
                      name="Revenue"
                    />

                    {/* Students (line) */}
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="students"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Students"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
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
