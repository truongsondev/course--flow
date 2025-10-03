import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Pencil, Eye, Users, BarChart2 } from "lucide-react";
import { NewCourseWizard, type CourseFormType } from "./course-form";
import type { CourseInstructorResponse } from "@/dto/response/course.response.dto";
import { uploadFileToCloud } from "@/lib/utils";

type Course = CourseInstructorResponse;
const statusColors: Record<Course["status"], string> = {
  published: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  draft: "bg-gray-100 text-gray-600",
};

export const CoursesPage: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const [open, setOpen] = useState(false);

  const uploadIfFile = async (
    value: string | File | undefined,
    typeFile: string
  ) => {
    if (value instanceof File) {
      const uploaded = await uploadFileToCloud(value, typeFile);
      return uploaded?.url ?? "";
    }
    return value ?? "";
  };

  const handleNewCourse = async (data: CourseFormType) => {
    const newData = { ...data };
    console.log("Submitting new course:", newData);
    console.time("upload all files");
    [newData.videoUrl, newData.thumbnailUrl] = await Promise.all([
      uploadIfFile(newData.videoUrl, "video"),
      uploadIfFile(newData.thumbnailUrl, "image"),
    ]);

    await Promise.all(
      newData.sessions.flatMap((session) =>
        session.lessons.map(async (lesson) => {
          lesson.video_url = await uploadIfFile(lesson.video_url, "video");
          lesson.doc_url = await uploadIfFile(lesson.doc_url, "document");
        })
      )
    );
    console.timeEnd("upload all files");
    console.log(newData);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center ">
        <h3 className="text-2xl font-bold tracking-tight">
          Instructor Dashboard
        </h3>
        <NewCourseWizard
          onSubmit={handleNewCourse}
          open={open}
          setOpen={setOpen}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl shadow-md border hover:shadow-lg transition overflow-hidden group"
          >
            <div className="h-40 w-full bg-gray-100 relative">
              <img
                src={c.thumbnail_url || "default-course-thumbnail.jpg"}
                alt={c.title}
                className="h-full w-full object-cover"
              />
              <span
                className={`absolute top-3 right-3 text-xs font-medium px-3 py-1 rounded-full ${
                  statusColors[c.status]
                }`}
              >
                {c.status}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-semibold text-lg text-gray-900 line-clamp-1">
                  {c.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {c.students} students • ${c.price}
                </p>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>⭐ {c.rating ? c.rating.toFixed(1) : "N/A"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Created {new Date(c.createdAt).toLocaleDateString()}
                </span>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" className="rounded-lg">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Users className="w-4 h-4 mr-1" />
                    Students
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <BarChart2 className="w-4 h-4 mr-1" />
                    Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
