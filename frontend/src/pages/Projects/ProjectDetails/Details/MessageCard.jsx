const MessageCard = ({
  message,
  onChange,
  onSend,
  placeholder = "Write your message...",
  disabled = false,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-8">
      
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Messages
      </h2>

      {/* Textarea */}
      <textarea
        value={message}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={6}
        className="
          w-full
          border rounded-lg
          px-4 py-3
          text-sm text-gray-900
          focus:outline-none focus:ring-2 focus:ring-blue-500
          resize-none
        "
      />

      {/* Button */}
      <div className="mt-4">
        <button
          onClick={onSend}
          disabled={disabled}
          className="
            bg-blue-600 text-white
            text-sm font-medium
            px-4 py-2
            rounded
            shadow
            hover:bg-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          Send message to client
        </button>
      </div>
    </div>
  );
};

export default MessageCard;