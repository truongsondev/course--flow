import { useEffect, useState } from "react";
import { X } from "lucide-react";
import userService from "@/services/user.service";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export default function FacebookStyleProfile() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [tab, setTab] = useState("courses");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser?.id) return;
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await userService.getUser(authUser.id);
        console.log(res.data.data);
        setProfile(res.data.data);
      } catch (error: any) {
        toast.error("Unable to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [authUser?.id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!profile)
    return (
      <div className="p-10 text-center text-red-600">
        User information not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <div
        className="h-72 w-full bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1503264116251-35a269479413?w=1200)`,
        }}
      >
        <div className="absolute bottom-4 right-6">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-black/70 text-white text-sm rounded-lg shadow hover:bg-black"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 relative -mt-20">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <img
              src={profile.avt_url || "t1.png "}
              alt="Avatar"
              className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">{profile.fullName}</h1>
              <p className="text-gray-600">
                {profile.bio || "No bio available."}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 flex gap-6 text-sm font-medium">
            {[
              { id: "about", label: "About" },
              { id: "courses", label: "Courses" },
              { id: "skills", label: "Skills" },
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
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-gray-700 leading-relaxed">
              {profile.bio || "No introduction available."}
            </p>
          </div>
        )}

        {tab === "courses" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">My Courses</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {profile.courses?.length > 0 ? (
                profile.courses.map((c: any) => (
                  <div
                    key={c.id}
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
                  >
                    <h3 className="font-medium">{c.title}</h3>
                    <p className="text-sm text-gray-500">{c.status}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">You have no courses.</p>
              )}
            </div>
          </div>
        )}

        {tab === "skills" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Skills</h2>
            <div className="flex gap-2 flex-wrap">
              {["React", "Node.js", "SQL", "TypeScript"].map((skill, i) => (
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
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form
              className="grid gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const form = e.target as HTMLFormElement;

                  const email = (
                    form.elements.namedItem("email") as HTMLInputElement
                  ).value;
                  const fullName = (
                    form.elements.namedItem("fullName") as HTMLInputElement
                  ).value;
                  const bio = (
                    form.elements.namedItem("bio") as HTMLTextAreaElement
                  ).value;
                  const avatarFile = (
                    form.elements.namedItem("avatar") as HTMLInputElement
                  ).files?.[0];

                  const formData = new FormData();
                  formData.append("email", email);
                  formData.append("fullName", fullName);
                  formData.append("bio", bio);

                  if (avatarFile) {
                    formData.append("avatar", avatarFile);
                  }

                  await userService.updateUserMultipart(
                    authUser?.id || "",
                    formData
                  );

                  setProfile({
                    ...profile,
                    fullName,
                    email,
                    bio,
                    avt_url: avatarPreview || profile.avt_url,
                  });

                  toast.success("Profile updated successfully!");
                  setIsEditing(false);
                } catch {
                  toast.error("Unable to update profile.");
                }
              }}
            >
              {/* EMAIL */}
              <input
                name="email"
                placeholder="Email"
                defaultValue={profile.email}
                className="w-full border rounded px-3 py-2"
              />

              {/* FULL NAME */}
              <input
                name="fullName"
                placeholder="Full Name"
                defaultValue={profile.fullName}
                className="w-full border rounded px-3 py-2"
              />

              {/* AVATAR UPLOAD + LIVE PREVIEW */}
              <div>
                <label className="block mb-1 text-sm font-medium">Avatar</label>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  className="w-full border rounded px-3 py-2"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const previewUrl = URL.createObjectURL(file);
                      setAvatarPreview(previewUrl);
                    }
                  }}
                />

                {/* PREVIEW */}
                {(avatarPreview || profile.avt_url) && (
                  <img
                    src={avatarPreview || profile.avt_url}
                    alt="Preview"
                    className="mt-3 w-32 h-32 rounded-full object-cover border shadow"
                  />
                )}
              </div>

              {/* BIO */}
              <textarea
                name="bio"
                placeholder="Bio"
                defaultValue={profile.bio}
                className="w-full border rounded px-3 py-2 h-24"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
