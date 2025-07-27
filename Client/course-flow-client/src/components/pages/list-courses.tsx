import { useEffect, useState, type FunctionComponent } from "react";
import Course from "./course";
import CourseLoading from "../loads/course-loading";
import { TITLE_IN_COURSE } from "@/constants/text-display";
import { MyPagination } from "./pagination";
interface ListCoursesProps {}
const typedCourse = [
  {
    image: "khoa-hoc-dem-hat-Piano.jpg",
    title: "Learn Piano for beginners",
    description: "A comprehensive guide to mastering piano.",
    author: "Truong Son",
    level: "Beginner",
    price: "$49.99",
    rating: 4.5,
  },
  {
    image: "banner-2.jpg",
    title: "Learn React",
    description: "A comprehensive guide to mastering React.",
    author: "John Doe",
    level: "Beginner",
    price: "$49.99",
    rating: 4.5,
  },
  {
    image: "banner-3.jpg",
    title: "Learn React",
    description: "A comprehensive guide to mastering React.",
    author: "John Doe",
    level: "Beginner",
    price: "$49.99",
    rating: 4.5,
  },
  {
    image: "banner-4.jpg",
    title: "Learn React",
    description: "A comprehensive guide to mastering React.",
    author: "John Doe",
    level: "Beginner",
    price: "$49.99",
    rating: 4.5,
  },
  {
    image: "khoa-hoc-dem-hat-Piano.jpg",
    title: "Learn Piano for beginners",
    description: "A comprehensive guide to mastering piano.",
    author: "Truong Son",
    level: "Beginner",
    price: "$49.99",
    rating: 4.5,
  },
  {
    image: "banner-2.jpg",
    title: "Learn React",
    description: "A comprehensive guide to mastering React.",
    author: "John Doe",
    level: "Beginner",
    price: "$49.99",
    rating: 4.5,
  },
  {
    image: "banner-3.jpg",
    title: "Learn React",
    description: "A comprehensive guide to mastering React.",
    author: "John Doe",
    level: "Beginner",
    price: "$49.99",
    rating: 4.5,
  },
  {
    image: "banner-4.jpg",
    title: "Learn React",
    description: "A comprehensive guide to mastering React.",
    author: "John Doe",
    level: "Beginner",
    price: "$49.99",
    rating: 4.5,
  },
];
const ListCourses: FunctionComponent<ListCoursesProps> = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  });

  if (loading) {
    return (
      <div className="flex flex-wrap items-start gap-4 max-sm:justify-center">
        {Array.from({ length: 10 }).map((_) => (
          <CourseLoading></CourseLoading>
        ))}
      </div>
    );
  }
  return (
    <div className="w-full bg-white px-4 m-auto flex flex-col gap-10">
      <div className="bg-white shadow-lg py-2 w-full hidden sm:block">
        <span className="text-2xl font-bold ">{TITLE_IN_COURSE}</span>
      </div>
      <div className="flex flex-wrap items-start gap-4 max-sm:justify-center">
        <Course courses={typedCourse} />
      </div>
      <MyPagination />
    </div>
  );
};

export default ListCourses;
