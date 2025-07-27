import type { FunctionComponent } from "react";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";

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
  return (
    <>
      {courses &&
        courses.map((course, index) => (
          <div
            key={index}
            className="group relative w-[200px] xs:w-[270px] bg-[#FDFBF9] rounded-t-[15px] overflow-hidden"
          >
            <div className="flex flex-col items-start justify-start">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-[150px] object-cover rounded-t-[10px]"
              />
              <div className="flex flex-col gap-2 w-full px-2 pb-3">
                <h2 className="text-xl font-bold">{course.title}</h2>
                <p className="text-sm text-gray-600 w-full truncate">
                  {course.description}
                </p>
                <p className="text-sm text-gray-500 flex items-center justify-between">
                  <span>Author:</span> <span>{course.author}</span>
                </p>
                <p className="text-sm text-gray-500 flex items-center justify-between">
                  <span>Level: </span> <span>{course.level}</span>
                </p>
                <div className="flex items-center justify-between w-full">
                  <p className="text-yellow-500">Rating: {course.rating} ★</p>
                  <p className="text-lg font-semibold">{course.price}</p>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-sky-100/60 opacity-0  group-hover:opacity-100 transition-opacity flex items-center justify-center ">
              <Button className="w-[40%] bg-emerald-500 hover:bg-white cursor-pointer border-2 border-emerald-500 hover:text-emerald-500">
                <span>
                  <ShoppingCart />
                </span>
                Register
              </Button>
            </div>
          </div>
        ))}
    </>
  );
};

export default Course;
