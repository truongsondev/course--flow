import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import courseService from "@/services/course.service";
import { Star } from "lucide-react";
import type { CourseHomeResponse } from "@/dto/response/course.response.dto";

export default function SearchPage() {
  const [courses, setCourses] = useState<CourseHomeResponse[]>([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (!query) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await courseService.getCourseForHome(10);
        setCourses(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">
          Kết quả tìm kiếm cho:{" "}
          <span className="text-indigo-600">“{query}”</span>
        </h1>

        {/* Bộ lọc */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <select className="border rounded-lg p-2 text-sm">
            <option value="">Tất cả mức giá</option>
            <option value="free">Miễn phí</option>
            <option value="paid">Trả phí</option>
          </select>

          <select className="border rounded-lg p-2 text-sm">
            <option value="">Tất cả đánh giá</option>
            <option value="4">⭐ Từ 4 sao</option>
            <option value="3">⭐ Từ 3 sao</option>
          </select>

          <select className="border rounded-lg p-2 text-sm">
            <option value="">Tất cả thể loại</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="design">Design</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-gray-500">Đang tải...</div>
        )}

        {/* Kết quả */}
        {!loading && (
          <>
            {courses.length === 0 ? (
              <div className="text-gray-500 italic">
                Không có khóa học nào phù hợp.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                  >
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-gray-800 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500">{course.students}</p>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={
                              i < (course.avgRating || 0)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        ))}
                        <span className="ml-1 text-gray-600">
                          ({course.avgRating || 0})
                        </span>
                      </div>
                      <div className="text-indigo-600 font-bold text-lg">
                        ${course.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
