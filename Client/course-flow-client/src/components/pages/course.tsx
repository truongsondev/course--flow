import type { FunctionComponent } from "react";

type CourseItem = {
  image: string;
  title: string;
  description: string;
  author: string;
  level: string;
  price: string;
  rating: number;
};

interface CourseProps {
  courses: CourseItem[];
}

const Course: FunctionComponent<CourseProps> = ({ courses }) => {
  console.log("Courses:", courses);
  return (
    <>
      {courses &&
        courses.map((course, index) => (
          <div
            key={index}
            className="flex flex-col items-start justify-start w-[285px]   bg-[#FDFBF9] rounded-t-[15px]"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-[150px] object-cover rounded-t-[10px]"
            />

            <div className="flex flex-col gap-2 w-full px-2">
              <h2 className="text-xl font-bold">{course.title}</h2>
              <p className="text-sm text-gray-600">{course.description}</p>
              <p className="text-sm text-gray-500">Author: {course.author}</p>
              <p className="text-sm text-gray-500">Level: {course.level}</p>
              <p className="text-lg font-semibold">{course.price}</p>
              <p className="text-yellow-500">Rating: {course.rating} ★</p>
            </div>
          </div>
        ))}
    </>
  );
};

export default Course;
