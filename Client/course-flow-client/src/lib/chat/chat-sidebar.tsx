import { useAuth } from "@/contexts/auth-context";
import type { ChatInfor } from "@/dto/response/chat.response.dto";
import chatService from "@/services/chat.service";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function ChatSidebar({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (user: any) => void;
}) {
  const [chat, setChat] = useState<ChatInfor[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    try {
      const fetchChatList = async () => {
        const res = await chatService.getAllChatInfor(user?.id || "");
        setChat(res.data.data);
      };
      fetchChatList();
    } catch (e) {}
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-black/30">
      <div className="w-[350px] h-full bg-white shadow-xl border-l animate-slide-left flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chat</h2>
          <button
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-3">
          <input
            placeholder="Tìm kiếm trên Messenger"
            className="w-full p-2.5 rounded-full bg-gray-100 text-sm outline-none"
          />
        </div>

        <div className="overflow-y-auto flex-1">
          {chat.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(item);
              }}
            >
              <img
                src={item.avt_url || "/t1.png"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-medium">{item.full_name || "Student"}</div>
                <div className="text-sm text-gray-500 truncate">
                  {item.message} · {item.sentAt.toString()}
                </div>
              </div>

              <span className="w-2 h-2 bg-blue-600 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
