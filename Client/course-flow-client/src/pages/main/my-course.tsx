import { useAuth } from "@/contexts/auth-context";
import type {
  CategoriesResponse,
  MyCourseResponse,
} from "@/dto/response/course.response.dto";
import courseService from "@/services/course.service";
import { motion } from "framer-motion";
import { MoreVertical, Search, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function MyLearning() {
  const [course, setCourse] = useState<MyCourseResponse[]>([]);
  const [categories, setCategories] = useState<CategoriesResponse[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchCourse(), fetchCategory()]);
    };
    const fetchCourse = async () => {
      const res = await courseService.getMyCourse(user?.id || "");
      setCourse(res.data.data);
    };
    const fetchCategory = async () => {
      const res = await courseService.getAllCategories();
      setCategories(res.data.data);
    };
    fetchData();
  }, []);

  const filterCourse = async (category?: string, sortByTime?: string) => {
    try {
      if (category) {
        const res = await courseService.getMyCourse(user?.id || "", {
          c: category,
        });
        setCourse(res.data.data);
      }
      if (sortByTime) {
        let sortedCourses = [...course];
        if (sortByTime === "latest") {
          sortedCourses.sort(
            (a, b) =>
              new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
          );
        } else {
          sortedCourses.sort(
            (a, b) =>
              new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
          );
        }
        setCourse(sortedCourses);
      }
    } catch (error) {
      console.error("Error filtering courses:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-10 py-6">
        <h1 className="text-4xl font-bold mb-2">My courses</h1>

        <nav className="mt-6 flex gap-6 text-sm font-medium">
          {[
            "Learn without limits",
            "Prove your growth",
            "Keep what matters",
            "Empower your journey",
          ].map((tab, i) => (
            <a
              key={i}
              href="#"
              className={`pb-2 ${"border-b-2 border-purple-400 text-white"}`}
            >
              {tab}
            </a>
          ))}
        </nav>
      </header>

      <main className="px-10 py-8">
        <div className="bg-white border rounded-xl p-6 flex items-center justify-between mb-8 shadow-sm">
          <div>
            <h3 className="font-semibold mb-2">Schedule learning time</h3>
            <p className="text-gray-600 text-sm max-w-xl">
              Learning a little each day adds up. Research shows that students
              who make learning a habit are more likely to reach their goals.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">
              Get started
            </button>
            <button className="px-4 py-2 border rounded-lg">Dismiss</button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <select
            onChange={(e) => filterCourse(e.target.value, "")}
            className="px-3 py-2 border rounded-lg"
          >
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => filterCourse("", e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value={"latest"}>latest</option>
            <option value={"old"}>old</option>
          </select>

          <div className="ml-auto flex items-center border rounded-lg px-3 py-2">
            <input
              type="text"
              placeholder="Search my courses"
              className="outline-none w-48 text-sm"
            />
            <Search className="w-4 h-4 text-purple-600" />
          </div>
        </div>
        {course && course.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {course.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border rounded-xl overflow-hidden shadow-sm relative group cursor-pointer"
              >
                <div className="relative w-full h-36">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  >
                    <button className="w-12 h-12 flex items-center justify-center bg-white text-purple-600 rounded-full shadow-lg hover:scale-110 transition">
                      <Play className="w-6 h-6" fill="currentColor" />
                    </button>
                  </div>
                  <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4">
                  <h2 className="text-sm font-semibold mb-1 line-clamp-2">
                    {course.title}
                  </h2>
                  <p className="text-xs text-gray-600 mb-3">
                    {course.instructorName}
                  </p>
                  {course.progressPercentage > 0 ? (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${course.progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {course.progressPercentage}% complete
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500">START COURSE</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {course.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">You have not enrolled in any courses yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
