import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { Pencil, Eye, Users, BarChart2 } from "lucide-react";
import {
  NewCourseWizard,
  type CourseFormType,
} from "./form-managerment/course-form";
import type {
  CourseEditReponse,
  CourseInstructorResponse,
} from "@/dto/response/course.response.dto";
import { passStringToJson } from "@/lib/utils";
import instanceCloudService from "@/services/cloud.service";
import _ from "lodash";
import type { CreateCourseRequestDto } from "@/dto/request/course.request.dto";
import courseService from "@/services/course.service";
import { toast } from "sonner";
import cloudService from "@/services/cloud.service";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { ACTION } from "@/constants/action";
import { EditCourseForm } from "./edit-course/course-form-edit";
import { useCourseModals } from "@/hooks/useCourseModals";
type Course = CourseInstructorResponse;
const statusColors: Record<Course["status"], string> = {
  published: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  draft: "bg-gray-100 text-gray-600",
};

export const CoursesPage: React.FC<{ courses: CourseInstructorResponse[] }> = ({
  courses,
}) => {
  const [open, setOpen] = useState(false);
  const uploadedFileIds: string[] = [];
  const navigate = useNavigate();
  const location = useLocation();
  const { action, courseId, openModal, closeModal } = useCourseModals();
  const uploadIfFile = async (
    value: string | File | undefined,
    typeFile: string
  ) => {
    if (value instanceof File) {
      const uploaded = await instanceCloudService.uploadFileToCloud(
        value,
        typeFile
      );
      if (uploaded && uploaded.fileId) {
        uploadedFileIds.push(uploaded.fileId);
      }
      return uploaded?.url ?? "";
    }
    return value ?? "";
  };

  useEffect(() => {
    if (
      action === ACTION.CREATE ||
      action === ACTION.EDIT ||
      action === ACTION.DELETE ||
      action === ACTION.PREVIEW
    ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [action, courseId]);

  async function transformCourseFormToDto(
    formData: CourseFormType,
    instructorId: string
  ): Promise<CreateCourseRequestDto> {
    const newData = _.cloneDeep(formData);

    const [videoUrl, thumbnailUrl] = await Promise.all([
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

    return {
      title: newData.title,
      description: newData.description,
      category_id: newData.category_id,
      price: newData.price,
      thumbnailUrl: thumbnailUrl || "",
      videoUrl: videoUrl || "",
      status: newData.status,
      instructorId,
      requirements: newData.requirements || [],
      sessions: newData.sessions,
    };
  }

  const handleNewCourse = async (data: CourseFormType) => {
    try {
      const user = localStorage.getItem("user");
      const userObj = passStringToJson(user);

      // const dataRequest = await transformCourseFormToDto(
      //   data,
      //   userObj?.id || 0
      // );
      // await courseService.createCourse(dataRequest);
      // toast.success("Course created successfully!");

      const formData = new FormData();
      const meta = {
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        price: data.price,
        status: data.status,
        instructorId: userObj?.id || 0,
        requirements: data.requirements,
        sessions: data.sessions.map((session) => ({
          title: session.title,
          position: session.position,
          lessons: session.lessons.map((lession) => ({
            title: lession.title,
            position: lession.position,
          })),
        })),
      };
      formData.append("meta", JSON.stringify(meta));
      formData.append("videoUrl", data.videoUrl);
      formData.append("thumbnailUrl", data.thumbnailUrl);
      data.sessions.forEach((session, i) => {
        session.lessons.forEach((lesson, j) => {
          if (lesson.video_url) {
            formData.append(
              `sessions[${i}][lessons][${j}][video]`,
              lesson.video_url
            );
          }
          if (lesson.doc_url) {
            formData.append(
              `sessions[${i}][lessons][${j}][doc]`,
              lesson.doc_url
            );
          }
        });
      });
      console.log("cgt");
      await courseService.createCourse(formData);

      //closeModal();
    } catch (error) {
      cloudService.deleteFileFromCloud(uploadedFileIds);
      toast.error("Failed to create course. Please try again.");
    }
  };

  const handleEditCourse = async (courseId: string) => {
    const searchParam = new URLSearchParams(location.search);
    searchParam.set("courseId", courseId);
    navigate(`${location.pathname}?${searchParam.toString()}`);
  };

  const handleSubmitEditCourse = async (course: CourseEditReponse) => {
    console.log(course);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center ">
        <div className="flex flex-row justify-between w-full">
          <h3 className="text-2xl font-bold tracking-tight">
            Instructor Dashboard
          </h3>
          <Button
            size="lg"
            className="rounded-xl"
            onClick={() => openModal(ACTION.CREATE)}
          >
            + New Course
          </Button>
        </div>
        {action === ACTION.CREATE && (
          <NewCourseWizard
            onSubmit={handleNewCourse}
            open={open}
            setOpen={(v) => !v && closeModal()}
          />
        )}
        {action === ACTION.EDIT && (
          <EditCourseForm
            open={open}
            setOpen={(v) => !v && closeModal()}
            onSubmit={handleSubmitEditCourse}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl shadow-md border hover:shadow-lg transition overflow-hidden group"
          >
            <div className="h-40 w-full bg-gray-100 relative">
              <img
                src={c.thumbnailUrl || "default-course-thumbnail.jpg"}
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
                <span>⭐ {c.avgRating ? c.avgRating.toFixed(1) : "N/A"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Created {new Date(c.createdAt).toLocaleDateString()}
                </span>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => openModal(ACTION.EDIT, c.id)}
                  >
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
