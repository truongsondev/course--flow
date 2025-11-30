import { useAuth } from "@/contexts/auth-context";
import type { ChatInfor } from "@/dto/response/chat.response.dto";
import type { UserChat } from "@/dto/response/user.response.dto";
import chatService from "@/services/chat.service";
import userService from "@/services/user.service";
import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

export default function ChatWindow({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const { user: userLogin } = useAuth();
  const currentUserId = userLogin?.id || "";

  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatInfor[]>([]);
  const [user, setUser] = useState<UserChat>({
    id: "",
    full_name: "Student",
    avt_url: "/t1.png",
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = io("http://localhost:3001", { transports: ["websocket"] });
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handler = (data: ChatInfor) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receiveMessage", handler);

    return () => {
      socket.off("receiveMessage", handler);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !currentUserId) return;
    socket.emit("register", currentUserId);
  }, [socket, currentUserId]);

  useEffect(() => {
    const load = async () => {
      const [msgRes, userRes] = await Promise.all([
        chatService.getAllMessage(userId, currentUserId),
        userService.getUserChat(userId),
      ]);

      setMessages(msgRes.data.data);
      setUser(userRes.data.data);
    };

    load();
  }, [userId, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !socket) return;

    const tempMessage: ChatInfor = {
      id: "local-" + Date.now(),
      fromUserId: currentUserId,
      toUserId: userId,
      content: message,
      sentAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    socket.emit("sendMessage", {
      fromUserId: currentUserId,
      toUserId: userId,
      message,
    });

    setMessage("");
  };

  return (
    <div className="w-[320px] h-[420px] bg-white shadow-2xl rounded-xl flex flex-col">
      {/* HEADER */}
      <div className="p-3 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={user?.avt_url || "/t1.png"}
            className="rounded-full w-[30px] h-[30px] object-cover"
          />
          <span className="font-medium">{user?.full_name || "Anonymous"}</span>
        </div>
        <button onClick={onClose}>✕</button>
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {messages.map((msg) => {
          const isMe = msg.fromUserId === currentUserId;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <img
                  src={user.avt_url || "/t1.png"}
                  className="rounded-full w-[26px] h-[26px] object-cover"
                />
              )}

              <span
                className={`px-3 py-2 rounded-2xl text-sm max-w-[70%] break-words ${
                  isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.content}
              </span>

              {isMe && (
                <img
                  src={userLogin?.avt_url || "/t1.png"}
                  className="rounded-full w-[26px] h-[26px] object-cover"
                />
              )}
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="p-3 border-t flex flex-row justify-between items-center">
        <input
          className="w-[85%] border rounded-lg p-2 text-sm"
          placeholder={`Message ${user?.full_name}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <SendHorizontal
          className="text-blue-500 cursor-pointer"
          onClick={sendMessage}
        />
      </div>
    </div>
  );
}
