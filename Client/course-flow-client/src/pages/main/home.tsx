import { useEffect, useState, type JSX } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import CategoryPage from "@/components/pages/category";
import Course from "@/components/pages/course";

import type {
  CategoriesResponse,
  CourseHomeResponse,
} from "@/dto/response/course.response.dto";
import courseService from "@/services/course.service";
import { formatCurrency } from "@/lib/utils";

export default function HomePage(): JSX.Element {
  const { t } = useTranslation("home");

  const [courses, setCourses] = useState<CourseHomeResponse[]>([]);
  const [category, setCategory] = useState<CategoriesResponse[]>([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchCourse = async (pageNumber: number = 1) => {
    const res = await courseService.getCourse(4, pageNumber);
    setCourses(res.data.data.data);
    setTotalPages(res.data.data.meta.totalPages);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await courseService.getAllCategories();
      if (res.data.data.length <= 6) {
        setCategory(res.data.data);
      }
      const data = res.data.data.slice(0, 6);
      setCategory(data);
    };

    const fetchData = async () => {
      await Promise.all([fetchCourse(), fetchCategory()]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchCourse(page);
  }, [page]);

  const searchCourse = async () => {
    try {
      const res = await courseService.searchCourse(search);
      setCourses(res.data.data);
    } catch (error) {
      console.error("Search course error: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-white to-pink-50"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500"
            >
              {t("hero.title1")}
              <br />
              <span className="text-slate-800">{t("hero.title2")}</span>
            </motion.h1>

            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              {t("hero.subtitle")}
            </p>

            {/* SEARCH BOX */}
            <div className="mt-8 flex gap-3 items-center">
              <div className="flex-1 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 border border-slate-200">
                <input
                  className="flex-1 outline-none text-sm"
                  placeholder={t("hero.searchPlaceholder")}
                  aria-label="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  onClick={searchCourse}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm shadow hover:bg-indigo-700 transition"
                >
                  {t("hero.searchButton")}
                </button>
              </div>
            </div>

            {/* INFO BOXES */}
            <div className="mt-8 flex items-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center font-semibold text-indigo-600">
                  ★
                </div>
                <div>
                  <div className="text-base font-semibold">4.8/5</div>
                  <div className="text-xs">{t("hero.ratingLabel")}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center font-semibold text-pink-600">
                  👩‍🏫
                </div>
                <div>
                  <div className="text-base font-semibold">
                    {t("hero.instructorCount")}
                  </div>
                  <div className="text-xs">{t("hero.instructorLabel")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- FEATURED COURSE ---------------- */}
          {courses.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200">
                <img
                  src={
                    courses[0]?.thumbnailUrl ||
                    "https://picsum.photos/seed/hero/900/600"
                  }
                  alt="Hero"
                  className="w-full h-[400px] object-cover"
                />
              </div>

              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur rounded-2xl shadow-lg p-4 w-72">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">
                      {t("hero.featuredLabel")}
                    </div>
                    <div className="font-semibold">
                      {courses[0]?.title ?? t("featuredFallback.title")}
                    </div>
                  </div>
                  <div className="text-sm text-indigo-600 font-semibold">
                    {formatCurrency(Number(courses[0]?.price) || 0)}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // FALLBACK UI
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200">
                <img
                  src="https://picsum.photos/seed/hero/900/600"
                  alt="Hero"
                  className="w-full h-[400px] object-cover"
                />
              </div>

              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur rounded-2xl shadow-lg p-4 w-72">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">
                      {t("hero.featuredLabel")}
                    </div>
                    <div className="font-semibold">
                      {t("featuredFallback.title")}
                    </div>
                  </div>
                  <div className="text-sm text-indigo-600 font-semibold">
                    {t("featuredFallback.price")}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-slate-600">
                  <div>{t("featuredFallback.lessons")}</div>
                  <div>{t("featuredFallback.hours")}</div>
                  <div>{t("featuredFallback.level")}</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <CategoryPage categories={category} />

      {/* ---------------- COURSE LIST ---------------- */}
      <section id="courses" className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">
            {t("courses.sectionTitle")}
          </h3>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.length > 0 ? (
            courses.map((course) => <Course key={course.id} course={course} />)
          ) : (
            <div className="col-span-full text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-lg font-medium">{t("courses.empty")}</p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10 select-none">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-indigo-50 border-gray-300 text-gray-700 hover:border-indigo-300"
              }`}
            >
              {t("pagination.previous")}
            </button>

            <span className="text-sm font-medium text-gray-600">
              {t("pagination.page")}{" "}
              <span className="text-indigo-600 font-semibold">{page}</span>{" "}
              {t("pagination.of")}{" "}
              <span className="text-gray-800 font-semibold">{totalPages}</span>
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-indigo-50 border-gray-300 text-gray-700 hover:border-indigo-300"
              }`}
            >
              {t("pagination.next")}
            </button>
          </div>
        )}
      </section>

      {/* ---------------- INSTRUCTORS ---------------- */}
      <section id="instructors" className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-semibold">
              {t("instructors.sectionTitle")}
            </h3>
            <p className="mt-3 text-slate-600 max-w-lg">
              {t("instructors.subtitle")}
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-3">
              {[1, 2, 3].map((i) => (
                <li
                  key={i}
                  className="bg-white p-4 rounded-2xl shadow flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    ✓
                  </div>
                  <div>
                    <div className="font-medium">
                      {t(`instructors.benefits.${i}`)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t("instructors.benefitNote")}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column */}
          <div className="hidden md:block">
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={`https://picsum.photos/seed/inst${i}/80/80`}
                      alt="inst"
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium">
                        {t("instructors.instructorName")} {i + 1}
                      </div>
                      <div className="text-xs text-slate-500">
                        {t("instructors.expertise")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
