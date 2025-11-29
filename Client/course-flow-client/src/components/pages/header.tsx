import { useEffect, useState, type FunctionComponent } from "react";
import { Link } from "react-scroll";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/auth-context";
import {
  Bell,
  MessageCircle,
  Moon,
  LogOut,
  UserCog,
  BookOpen,
  Blocks,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import authenService from "@/services/authen.service";
import { ChatSidebar } from "@/chat/chat-sidebar";
import ChatWindow from "@/chat/chat-windown";
import userService from "@/services/user.service";
import { toast } from "sonner";

interface HeaderPageProps {}

const HeaderPage: FunctionComponent<HeaderPageProps> = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const [openChat, setOpenChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  useEffect(() => {
    if (!user || !user?.id) {
      setRole("guest");
    }
    const fetchRole = async () => {
      const res = await authenService.checkRole(user?.id || "");
      setRole(res.data.data);
    };
    fetchRole();
  }, []);
  useEffect(() => {
    if (openChat) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openChat]);

  const becomeToInstructor = async () => {
    try {
      if (!user || !user.id) return;
      const res = await userService.becomeToInstructor(user.id);
      if (res.data.success) {
        navigate("/instructor");
      } else {
        toast.error("Failed to become an instructor.");
      }
    } catch (error) {
      console.log("Error become to instructor:", error);
    }
  };

  return (
    <>
      <header className="bg-white/60 backdrop-blur sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-extrabold tracking-tight">
              Course<span className="text-indigo-600">Flow</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
              <Link
                to="courses"
                smooth
                offset={-70}
                duration={500}
                className="hover:text-indigo-600 cursor-pointer"
              >
                Courses
              </Link>
              <Link
                to="categories"
                smooth
                offset={-70}
                duration={500}
                className="hover:text-indigo-600 cursor-pointer"
              >
                Categories
              </Link>
              <Link
                to="instructors"
                smooth
                offset={-70}
                duration={500}
                className="hover:text-indigo-600 cursor-pointer"
              >
                Instructors
              </Link>
              <Link
                to="blog"
                smooth
                offset={-70}
                duration={500}
                className="hover:text-indigo-600 cursor-pointer"
              >
                Blog
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  className="relative p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setOpenChat(true)}
                >
                  <MessageCircle className="w-5 h-5" />
                  {/* <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    1
                  </span> */}
                </button>

                <button className="relative p-2 rounded-full hover:bg-gray-100">
                  <Bell className="w-5 h-5" />
                  {/* <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    3
                  </span> */}
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer">
                      <Avatar className="w-9 h-9">
                        <AvatarImage
                          src={user.avt_url || "t1.png"}
                          alt={user.name ?? undefined}
                        />
                        <AvatarFallback>
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-64 p-2">
                    <div className="flex items-center gap-3 px-2 py-2">
                      <Avatar>
                        <AvatarImage src={user.avt_url || "t1.png"} />
                        <AvatarFallback>
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-xs text-gray-500">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => navigate("/user")}>
                      <UserCog className="mr-2 h-4 w-4" />
                      Manager account
                    </DropdownMenuItem>
                    {role === "instructor" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => navigate("/instructor")}
                        >
                          <BookOpen className="w-4 h-4 mr-2 " />
                          Manager course
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate("/my-courses")}
                        >
                          <BookOpen className="w-4 h-4 mr-2 " />
                          course Registed
                        </DropdownMenuItem>
                      </>
                    )}

                    {role === "student" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => navigate("/my-courses")}
                        >
                          <BookOpen className="w-4 h-4 mr-2 " />
                          Manager courses
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => becomeToInstructor()}>
                          <Blocks className="w-4 h-4 mr-2 " />
                          Become to instructor
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuItem
                      onClick={() => navigate("/auth/reset-password")}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Change password
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="hidden md:inline-block text-sm px-4 py-2 rounded-2xl border"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/auth/register")}
                  className="text-sm px-4 py-2 rounded-2xl bg-indigo-600 text-white shadow-md"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      {selectedUser && (
        <div className="fixed bottom-4 right-4 z-[9999]">
          <ChatWindow
            userId={selectedUser?.toUserId || ""}
            onClose={() => setSelectedUser(null)}
          />
        </div>
      )}
      {openChat && (
        <ChatSidebar
          onClose={() => setOpenChat(false)}
          onSelect={(user) => {
            setSelectedUser(user);
            setOpenChat(false);
          }}
        />
      )}
    </>
  );
};

export default HeaderPage;
