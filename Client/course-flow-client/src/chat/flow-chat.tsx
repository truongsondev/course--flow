import { useState } from "react";
import ChatWindow from "./chat-windown";

export function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {open ? <ChatWindow userId={""} onClose={() => setOpen(false)} /> : <></>}
    </div>
  );
}
