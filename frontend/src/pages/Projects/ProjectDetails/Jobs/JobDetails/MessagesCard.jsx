import { Send } from "lucide-react";
import { useState } from "react";

const MessagesCard = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend?.(message);
    setMessage("");
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      {/* Header */}
      <h3 className="text-base font-semibold text-gray-800">
        Messages
      </h3>

      {/* Textarea */}
      <textarea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message..."
        className="w-full border rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Action */}
      <div className="flex justify-end">
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagesCard;