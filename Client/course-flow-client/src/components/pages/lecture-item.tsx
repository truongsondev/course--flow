import { FaPlayCircle } from "react-icons/fa";

function LectureItem({ title, duration }: { title: string; duration: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm text-gray-700">
      <div className="flex items-center">
        <FaPlayCircle className="text-blue-500 mr-2" />
        <span>{title}</span>
      </div>
      <span className="text-gray-500">{duration}</span>
    </div>
  );
}
export default LectureItem;
