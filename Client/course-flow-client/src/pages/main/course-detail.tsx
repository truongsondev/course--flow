import { Star, Users, Clock } from "lucide-react";
import LectureItem from "@/components/pages/lecture-item";
import SubCourse from "@/components/pages/sub-course";
const lectures = [
  { title: "Welcome", duration: "05:30" },
  { title: "How to use this course", duration: "08:10" },
  { title: "Course overview", duration: "06:20" },
];
export default function CourseDetail() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Video + Info */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold">React Fundamentals</h1>
          <p className="text-gray-600">
            Learn the basics of React, from components to hooks, and start
            building modern web apps today.
          </p>

          {/* Rating & Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
              <span className="text-gray-700 ml-1">4.8</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={16} />
              <span>1,234 students</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>12h total</span>
            </div>
          </div>

          {/* Author */}
          <p className="text-sm text-gray-500">
            Created by <span className="text-blue-600">John Doe</span>
          </p>

          {/* Video */}
          <div className="aspect-video rounded overflow-hidden shadow">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/xDfbUZ3WJOk"
              title="[1080P] TRAILER T1 VS GENG LCK SPRING 2024 | TẤM LÒNG SON REMIX"
            ></iframe>
          </div>
        </div>

        {/* Right: Pricing Card */}
        <div className="border rounded-lg p-4 shadow space-y-4 max-w-sm">
          {/* Course Thumbnail */}
          <img
            src="/t1.png"
            alt="Course Thumbnail"
            className="w-full h-40 object-cover rounded"
          />

          {/* Price */}
          <div className="text-2xl font-bold">$49.99</div>

          {/* Button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Enroll Now
          </button>

          {/* Benefits */}
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✅ Lifetime access</li>
            <li>✅ Certificate of completion</li>
            <li>✅ Access on mobile and TV</li>
          </ul>
        </div>
      </div>

      {/* Course Content */}
      <section>
        <h2 className="text-xl font-bold mb-4">Course Content</h2>
        <div className="border rounded divide-y">
          <details className="p-3">
            <summary className="cursor-pointer font-semibold">
              Introduction (3 lectures • 20min)
            </summary>
            <ul className="mt-2 pl-4 text-sm text-gray-600 space-y-1">
              {lectures.map((item, index) => (
                <LectureItem
                  key={index}
                  title={item.title}
                  duration={item.duration}
                />
              ))}
            </ul>
          </details>
          <details className="p-3">
            <summary className="cursor-pointer font-semibold">
              React Basics (5 lectures • 45min)
            </summary>
            <ul className="mt-2 pl-4 text-sm text-gray-600 space-y-1">
              {lectures.map((item, index) => (
                <LectureItem
                  key={index}
                  title={item.title}
                  duration={item.duration}
                />
              ))}
            </ul>
          </details>
        </div>
      </section>

      {/* Requirements */}
      <section>
        <h2 className="text-xl font-bold mb-4">Requirements</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-1">
          <li>Basic understanding of HTML, CSS, and JavaScript</li>
          <li>No prior React knowledge required</li>
        </ul>
      </section>

      {/* Description */}
      <section>
        <h2 className="text-xl font-bold mb-4">Description</h2>
        <p className="text-gray-600">
          This course will guide you through the fundamentals of React, starting
          with components, props, and state, all the way to hooks and advanced
          patterns. You’ll build hands-on projects to solidify your skills.
        </p>
      </section>

      {/* Related Courses */}
      <section>
        <h2 className="text-xl font-bold mb-4">Related Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((id) => (
            <SubCourse id={id} />
          ))}
        </div>
      </section>
    </div>
  );
}
