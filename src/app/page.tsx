"use client";
import { useState } from "react";

type Message = {
  prompt: string;
  reply: string;
  from: "you" | "ai";
};

export default function HomePage() {
  const [inputPrompt, setInputPrompt] = useState("");
  const [agentPrompt, setAgentPrompt] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔁 Call the API to prompt the AI
  async function sendPrompt(prompt: string, from: "you" | "ai") {
    setLoading(true);
    setHistory((prev) => [...prev, { prompt, reply: "", from }]);

    if (from === "you") {
      setHistory((prev) => [
        ...prev,
        { prompt: "Typing...", reply: "", from: "ai" },
      ]);
    }

    const res = await fetch("/api/think", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();

    setHistory((prev) => {
      const updated = [...prev];
      if (from === "you") updated.pop(); // remove "Typing..." placeholder
      return [...updated, { prompt: "", reply: data.reply, from: "ai" }];
    });
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row p-6 gap-6 text-gray-50 bg-gray-900">
      {/* Left Column: Chat History */}
      <div className="flex-1 bg-slate-800 p-4 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">🧠 Aphrodite</h1>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {history.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.from === "you" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg shadow ${
                  msg.from === "you"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-white rounded-bl-none"
                }`}
              >
                <div className="text-sm whitespace-pre-line">
                  {msg.from === "you" ? (
                    <div>{msg.prompt}</div>
                  ) : (
                    <div>{msg.reply ? msg.reply : "Typing..."}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Your prompt input */}
        <div className="mt-6">
          <input
            className="w-full p-2 border rounded mb-2"
            placeholder="Type your message to the AI"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (inputPrompt.trim()) {
                  sendPrompt(inputPrompt, "you");
                  setInputPrompt("");
                }
              }
            }}
          />
          <button
            className="bg-slate-600 text-white px-4 py-2 rounded"
            onClick={() => {
              if (!inputPrompt.trim()) return;
              sendPrompt(inputPrompt, "you");
              setInputPrompt("");
            }}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send to AI"}
          </button>
        </div>
      </div>

      {/* Right Column: Agent Thinking */}
      <div className="w-full lg:w-96 bg-slate-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          🤔 Aphrodite Thinking Panel
        </h2>

        {/* Generate agent's suggestion */}
        <button
          className="bg-slate-600 text-white px-4 py-2 rounded w-full mb-2"
          onClick={async () => {
            setLoading(true);
            const res = await fetch("/api/generate-self-prompt", {
              method: "POST",
            });
            const data = await res.json();
            setAgentPrompt(data.prompt);
            setLoading(false);
          }}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Generate Self Prompt"}
        </button>

        {/* Show suggested prompt */}
        {agentPrompt && (
          <div className="border p-3 rounded mb-2">
            <div className="font-semibold mb-1">Suggested Prompt:</div>
            <div className="text-gray-300">{agentPrompt}</div>
          </div>
        )}

        {/* Approve or edit */}
        {agentPrompt && (
          <div className="flex flex-col gap-2">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => {
                sendPrompt(agentPrompt, "ai");
                setAgentPrompt("");
              }}
            >
              ✅ Approve & Send
            </button>
            <textarea
              className="w-full p-2 border rounded"
              rows={2}
              value={agentPrompt}
              onChange={(e) => setAgentPrompt(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
