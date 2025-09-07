import React, { useState } from "react";
import { X } from "lucide-react";

export default function FacebookStyleProfile() {
  const [tab, setTab] = useState("courses");
  const [isEditing, setIsEditing] = useState(false);

  const user = {
    name: "Lê Trường Sơn",
    avatar: "https://via.placeholder.com/150",
    cover:
      "https://images.unsplash.com/photo-1503264116251-35a269479413?w=1200",
    bio: "Sinh viên CNTT tại HCMUTE | Yêu thích React & Node.js 🚀",
    courses: [
      { title: "React Cơ bản", status: "Hoàn thành" },
      { title: "Node.js Nâng cao", status: "Đang học" },
    ],
  };

  const suggestedCourses = [
    {
      title: "Next.js từ A-Z",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600",
      desc: "Xây dựng ứng dụng web hiện đại với Next.js 13.",
    },
    {
      title: "UI/UX Design Cơ bản",
      image:
        "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=600",
      desc: "Nguyên tắc thiết kế giao diện người dùng đẹp mắt.",
    },
    {
      title: "TypeScript Mastery",
      image:
        "https://images.unsplash.com/photo-1584697964154-3f82e8e7b96c?w=600",
      desc: "Làm chủ TypeScript để code React & Node.js an toàn.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div
        className="h-72 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${user.cover})` }}
      >
        <div className="absolute bottom-4 right-6">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-black/70 text-white text-sm rounded-lg shadow hover:bg-black"
          >
            Chỉnh sửa hồ sơ
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 relative -mt-20">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center md:items-end md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-gray-600">{user.bio}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 flex gap-6 text-sm font-medium">
            {[
              { id: "about", label: "Giới thiệu" },
              { id: "courses", label: "Khóa học" },
              { id: "skills", label: "Kỹ năng" },
              { id: "payments", label: "Thanh toán" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`py-3 ${
                  tab === t.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        {tab === "about" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Giới thiệu</h2>
            <p className="text-gray-700 leading-relaxed">{user.bio}</p>
          </div>
        )}

        {tab === "courses" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Khóa học của tôi</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {user.courses.map((c, i) => (
                <div
                  key={i}
                  className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
                >
                  <h3 className="font-medium">{c.title}</h3>
                  <p className="text-sm text-gray-500">{c.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "skills" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Kỹ năng</h2>
            <div className="flex gap-2 flex-wrap">
              {["React", "Next.js", "Node.js", "UI/UX"].map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {tab === "payments" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Lịch sử thanh toán</h2>
            <p className="text-gray-500 text-sm">Chưa có dữ liệu</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Khóa học có thể bạn quan tâm
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {suggestedCourses.map((course, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {course.desc}
                  </p>
                  <button className="mt-2 text-sm text-blue-600 hover:underline">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa hồ sơ</h2>
            <form className="grid gap-4">
              <input
                placeholder="Tên"
                defaultValue={user.name}
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                placeholder="Giới thiệu"
                defaultValue={user.bio}
                className="w-full border rounded px-3 py-2 h-24"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-100 rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
