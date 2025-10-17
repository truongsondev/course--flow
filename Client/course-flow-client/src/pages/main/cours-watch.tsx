import type { CourseWatchResponse } from "@/dto/response/course.response.dto";
import { passStringToJson } from "@/lib/utils";
import courseService from "@/services/course.service";
import {
  FaPlayCircle,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaFileAlt,
} from "react-icons/fa";
import ReactPlayer from "react-player";
import { useParams } from "react-router";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

export default function CourseWatch() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseWatchResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [note, setNote] = useState("");

  const flatLectures = useMemo(() => {
    if (!course?.sessions) return [];
    return course.sessions.flatMap((s) => s.lessons);
  }, [course]);

  const currentVideo = flatLectures[currentIndex];
  const progress = Math.round((completed.length / flatLectures.length) * 100);

  const markCompleted = () => {
    if (!completed.includes(currentIndex)) {
      setCompleted([...completed, currentIndex]);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goNext = () => {
    if (currentIndex < flatLectures.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const userString = localStorage.getItem("user");
      const userJson = passStringToJson(userString);

      if (!id || !userJson) {
        toast.error("User data is invalid or missing. Please sign in again.");
        return;
      }

      try {
        const res = await courseService.getCourseForWatch(id, userJson.id);
        if (res.data?.data) {
          setCourse(res.data.data);
          setNote(res.data.data.note?.note || "");
        } else {
          toast.error("Không thể tải dữ liệu khóa học.");
        }
      } catch (error) {
        toast.error("Lỗi khi tải khóa học.");
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-3">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${course?.progress?.progressPercentage ?? 0}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {course?.progress?.progressPercentage?.toFixed(1) ?? 0}% completed
          </p>
        </div>

        <div className="bg-black rounded-lg overflow-hidden">
          {currentVideo ? (
            <ReactPlayer
              key={currentVideo.id}
              width="100%"
              height="620px"
              controls
              playbackRate={playbackRate}
            />
          ) : (
            <div className="text-white text-center py-40">
              No video available.
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() =>
                setPlaybackRate(
                  playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1
                )
              }
            >
              {playbackRate}x
            </button>
            <button
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={markCompleted}
            >
              <FaCheckCircle className="inline mr-1" /> Mark as Done
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={goPrev}
              disabled={currentIndex === 0}
            >
              <FaArrowLeft />
            </button>
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={goNext}
              disabled={currentIndex === flatLectures.length - 1}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        {currentVideo && (
          <>
            <h1 className="text-2xl font-bold mt-4">{currentVideo.title}</h1>
            <p className="text-gray-600 mt-2">
              {course?.description || "No description available."}
            </p>

            {currentVideo.docUrl && (
              <div className="mt-4">
                <h3 className="font-semibold">Tài liệu đi kèm</h3>
                <a
                  href={currentVideo.docUrl}
                  className="text-blue-600 flex items-center mt-1"
                  target="_blank"
                >
                  <FaFileAlt className="mr-2" /> {currentVideo.docUrl}
                </a>
              </div>
            )}
          </>
        )}

        <div className="mt-6">
          <h3 className="font-semibold">Ghi chú</h3>
          <textarea
            className="w-full border rounded p-2 mt-2"
            rows={4}
            placeholder="Viết ghi chú ở đây..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Q&A</h3>
          <p className="text-sm text-gray-500">Chức năng Q&A sẽ thêm sau.</p>
        </div>
      </div>

      <div className="w-full md:w-96 border-l border-gray-200 bg-white overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Nội dung khóa học</h2>
        {course?.sessions?.map((section, sIdx) => (
          <div key={section.id} className="mb-4">
            <h3 className="font-medium text-gray-800">{section.title}</h3>
            <div className="mt-2">
              {section.lessons.map((lesson, lIdx) => {
                const flatIndex =
                  course.sessions
                    .slice(0, sIdx)
                    .reduce((acc, s) => acc + s.lessons.length, 0) + lIdx;
                return (
                  <div
                    key={lesson.id}
                    onClick={() => setCurrentIndex(flatIndex)}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-100 ${
                      flatIndex === currentIndex ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <FaPlayCircle className="text-blue-500 mr-2" />
                      <span className="text-sm">{lesson.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {completed.includes(flatIndex) && (
                        <FaCheckCircle className="text-green-500" />
                      )}
                      <span className="text-xs text-gray-500">
                        {lesson.duration ? `${lesson.duration}m` : "--"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
