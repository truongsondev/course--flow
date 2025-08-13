import type { FunctionComponent } from "react";
import HeaderPage from "@/components/pages/header";
import SliderPage from "@/components/pages/slider";
import ListCourses from "@/components/pages/list-courses";
interface HomeProps {}

const Courses: FunctionComponent<HomeProps> = () => {
  return (
    <div className="flex flex-col items-start justify-start h-screen w-full gap-4">
      <div className="w-full">
        <HeaderPage />
      </div>
      <div className="w-full h-auto mt-4 ">
        <SliderPage />
      </div>
      <ListCourses id={0} title={""} author={""} price={0} />
    </div>
  );
};

export default Courses;
