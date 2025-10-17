import { Star, Users, Clock } from "lucide-react";
import LectureItem from "@/components/pages/lecture-item";
import SubCourse from "@/components/pages/sub-course";
import { useEffect, useState } from "react";
import type {
  CourseDetailResponse,
  LessonDetail,
} from "@/dto/response/course.response.dto";
import { useParams } from "react-router";
import courseService from "@/services/course.service";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  useEffect(() => {
    const fetchCourse = async () => {
      const res = await courseService.getCourseForDetail(id || "");
      setCourse(res.data.data);
    };
    fetchCourse();
  }, []);

  const totalTimeForeachSession = (lessons: LessonDetail[]) => {
    let sum = 0;
    for (let i = 0; i < lessons.length; ++i) {
      sum += lessons[i].duration;
    }
    return sum;
  };
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {course?.title || "title"}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {course?.description || "description"}
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
              <span className="text-gray-800 font-semibold ml-1">
                {course?.avgRating || 5}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>{course?.studentCount || 0} students</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{course?.totalDuration || 0}h total</span>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Created by{" "}
            <span className="text-blue-600 font-medium hover:underline cursor-pointer">
              {course?.instructorName || "user"}
            </span>
          </p>

          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
            {course?.videoUrl ? (
              <video
                key={course.videoUrl}
                className="w-full h-full object-cover"
                src={course.videoUrl}
                controls
                controlsList="nodownload"
                preload="metadata"
                poster={course.thumbnailUrl}
              >
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No preview available
              </div>
            )}
          </div>
        </div>

        <aside className="border rounded-2xl p-6 shadow-lg bg-white space-y-6">
          <img
            src={course?.thumbnailUrl}
            alt="Course Thumbnail"
            className="w-full h-48 object-cover rounded-xl"
          />

          <div className="text-3xl font-bold text-gray-900">
            ${course?.price || 0}
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition">
            Enroll Now
          </button>

          <ul className="text-sm text-gray-600 space-y-2">
            <li>✅ Lifetime access</li>
            <li>✅ Certificate of completion</li>
            <li>✅ Access on mobile and TV</li>
          </ul>
        </aside>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6">Course Content</h2>
        <div className="border rounded-2xl overflow-hidden divide-y">
          {course &&
            course.sessions.map((session) => (
              <details className="p-4 group" key={course.id}>
                <summary className="cursor-pointer font-semibold group-hover:text-blue-600">
                  Introduction ({session.lessons.length} lectures •{" "}
                  {totalTimeForeachSession(session.lessons)}min)
                </summary>
                <ul className="mt-3 pl-4 text-sm text-gray-600 space-y-2">
                  {session.lessons.map((item, index) => (
                    <LectureItem
                      key={index}
                      title={item.title}
                      duration={item.duration}
                    />
                  ))}
                </ul>
              </details>
            ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Requirements</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          {course &&
            course.requirements.map((requirement, index) => (
              <li key={index} className="text-gray-700">
                {requirement}
              </li>
            ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Description</h2>
        <p className="text-gray-600 leading-relaxed">
          {course?.description || "description"}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Related Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((id) => (
            <SubCourse key={id} id={id} />
          ))}
        </div>
      </section>
    </div>
  );
}
