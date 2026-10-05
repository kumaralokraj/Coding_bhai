import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/layout/Sidebar";
import MobileSidebar from "../../components/layout/MobileSidebar";

import { sendMessageToAI } from "../../services/aiService";

function AIMentor() {
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([]);

  const handleSend = async (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text || loading) return;

    // User message
    const userMessage = {
      role: "user",
      content: text,
    };

    const previousHistory = [...messages];

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      console.log("Sending message:", text);

      const response = await sendMessageToAI(
        text,
        previousHistory
      );

      console.log("AI RESPONSE:", response);

      // Backend response ke possible fields
      const aiText =
        response?.message ||
        response?.reply ||
        response?.answer ||
        response?.response ||
        response?.data?.message ||
        response?.data?.reply ||
        response?.data?.answer;

      if (!aiText) {
        throw new Error(
          "AI response mein message/reply/answer nahi mila."
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiText,
        },
      ]);
    } catch (error) {
      console.error("AI Mentor Error:", error);

      const backendError =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ ${backendError}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-800 px-5 lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-lg border border-slate-700 px-3 py-2"
        >
          ☰
        </button>

        <h1 className="text-xl font-bold">
          Coding<span className="text-cyan-400">Bhai</span>
        </h1>

        <div className="w-10" />
      </header>

      {/* Main */}
      <main className="lg:ml-64">

        <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-5xl flex-col px-4 py-6 lg:h-screen">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
                🤖
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  AI Mentor
                </h1>

                <p className="text-sm text-slate-500">
                  Your CodingBhai coding assistant
                </p>
              </div>

            </div>

            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 hover:border-red-500 hover:text-red-400"
              >
                Clear Chat
              </button>
            )}

          </div>

          {/* Chat */}
          <div className="flex-1 overflow-y-auto py-6">

            {messages.length === 0 ? (

              <div className="flex h-full items-center justify-center">

                <div className="max-w-lg text-center">

                  <div className="mb-5 text-6xl">
                    🤖
                  </div>

                  <h2 className="text-2xl font-bold">
                    Hey! I'm CodingBhai AI
                  </h2>

                  <p className="mt-3 text-slate-400">
                    Ask me anything about programming,
                    DSA, React, Node.js, debugging or system
                    design.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">

                    <button
                      onClick={() =>
                        setMessage("Explain React useEffect")
                      }
                      className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-left text-sm hover:border-cyan-500"
                    >
                      💡 Explain React useEffect
                    </button>

                    <button
                      onClick={() =>
                        setMessage("Explain JavaScript closure")
                      }
                      className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-left text-sm hover:border-cyan-500"
                    >
                      🧠 Explain JavaScript closure
                    </button>

                    <button
                      onClick={() =>
                        setMessage("Find the bug in my code")
                      }
                      className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-left text-sm hover:border-cyan-500"
                    >
                      🐛 Debug my code
                    </button>

                    <button
                      onClick={() =>
                        setMessage("Give me a DSA problem")
                      }
                      className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-left text-sm hover:border-cyan-500"
                    >
                      🧩 Give me a DSA problem
                    </button>

                  </div>

                </div>

              </div>

            ) : (

              <div className="space-y-5">

                {messages.map((msg, index) => (

                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-cyan-500 text-slate-950"
                          : "border border-slate-800 bg-slate-900 text-slate-200"
                      }`}
                    >

                      <p className="mb-1 text-xs font-semibold opacity-60">
                        {msg.role === "user"
                          ? "You"
                          : "CodingBhai AI"}
                      </p>

                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {msg.content}
                      </p>

                    </div>

                  </div>

                ))}

                {loading && (
                  <div className="flex justify-start">

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-400">
                      🤖 CodingBhai is thinking...
                    </div>

                  </div>
                )}

              </div>

            )}

          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="border-t border-slate-800 pt-4"
          >

            <div className="flex gap-3">

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask CodingBhai anything..."
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "..." : "Send"}
              </button>

            </div>

            <p className="mt-2 text-center text-xs text-slate-600">
              CodingBhai AI can make mistakes. Verify important code.
            </p>

          </form>

        </div>

      </main>

    </div>
  );
}

export default AIMentor;