export default function ChatBubble({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg"
    >
      💬
    </button>
  );
}
