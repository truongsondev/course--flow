import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Camera } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-gray-800">
          Profile Settings
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Manage your instructor account information
        </p>
      </div>

      {/* MAIN CARD */}
      <Card className="rounded-3xl border bg-white/80 backdrop-blur-sm shadow-[0_4px_18px_rgba(0,0,0,0.04)]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Personal Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-10">
          {/* ---------- AVATAR AREA (PRO STYLE) ---------- */}
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* AVATAR WITH OVERLAY */}
            <div className="relative group">
              <img
                src="https://i.pravatar.cc/300"
                className="
                  w-32 h-32 rounded-full object-cover shadow-sm border
                  transition duration-300 group-hover:brightness-90
                "
              />

              {/* OVERLAY UPLOAD BUTTON */}
              <div
                className="
                  absolute inset-0 rounded-full bg-black/0 
                  group-hover:bg-black/30 transition flex items-center justify-center
                "
              >
                <button
                  className="
                    opacity-0 group-hover:opacity-100 transition
                    bg-white/90 text-gray-700 border shadow-sm
                    p-2 rounded-full backdrop-blur-sm
                  "
                >
                  <Camera size={18} />
                </button>
              </div>
            </div>

            {/* TEXT INFO */}
            <div>
              <p className="text-sm font-medium text-gray-700">Profile Photo</p>
              <p className="text-xs text-gray-500">
                PNG or JPG — Max 2MB. Square image recommended.
              </p>
            </div>
          </div>

          {/* ---------- FORM FIELDS (PREMIUM DESIGN) ---------- */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FULL NAME */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  className="h-11 text-[15px] border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-500"
                  defaultValue="Lê Giảng Viên"
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  className="h-11 text-[15px] border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-500"
                  defaultValue="gvien@example.com"
                />
              </div>
            </div>

            {/* BIO */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <Textarea
                className="
                  min-h-[140px] text-[15px] border-gray-300 
                  focus-visible:ring-1 focus-visible:ring-gray-500
                "
                defaultValue="Giảng viên lập trình với hơn 10 năm kinh nghiệm trong việc đào tạo và phát triển phần mềm."
              />
            </div>
          </div>

          {/* ---------- SAVE BUTTON ---------- */}
          <div className="flex justify-end">
            <Button
              className="
                px-7 h-11 text-[15px]
                shadow-sm bg-gray-900 hover:bg-black text-white
              "
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
