import type { FunctionComponent } from "react";
import Course from "./course";

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
  return (
    <div className="w-full bg-white px-4">
      <div className="bg-white shadow-lg py-2 w-full">
        <span className="text-2xl font-bold">
          Course and Events For Product Designer
        </span>
      </div>
      <div className="flex flex-wrap gap-4 justify-start">
        <Course courses={typedCourse} />
      </div>
    </div>
  );
};

export default ListCourses;
