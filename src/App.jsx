
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";

function App() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "http://localhost:3001/api/chat",
    }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim() || status === "streaming") {
      return;
    }

    const message = input.trim();
    setInput("");

    await sendMessage({
      text: message,
    });
  };

  const loading =
    status === "submitted" || status === "streaming";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Header */}
      <header className="bg-gray-900 text-white p-4 text-center">
        <h1 className="text-xl font-bold">
          AI Assistant
        </h1>

        <p className="text-sm text-gray-400">
          Your intelligent chat assistant
        </p>
      </header>

      {/* Chat Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 overflow-y-auto">

        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold text-gray-800">
              How can I help you?
            </h2>

            <p className="text-gray-500 mt-2">
              Ask me anything and start a conversation.
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-4">

          {error && (
            <div role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-red-800">
              {error.message || "Could not get a reply. Check the server and API key."}
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 shadow"
                }`}
              >
                <ReactMarkdown>
                  {message.parts
                    ?.filter((part) => part.type === "text")
                    .map((part) => part.text)
                    .join("") ||
                    message.content ||
                    ""}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white shadow rounded-2xl px-4 py-3 text-gray-500">
                AI is typing...
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto p-4"
      >
        <div className="flex gap-2 bg-white rounded-2xl shadow p-2">

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 outline-none"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>

        </div>
      </form>

    </div>
  );
}

export default App;
