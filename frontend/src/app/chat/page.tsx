"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { api, type Model } from "@/lib/api";

function ChatContent() {
  const searchParams = useSearchParams();
  const modelIdParam = searchParams.get("model");
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(modelIdParam || "");
  const [messages, setMessages] = useState<{ role: "user" | "model"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.models.list().then(setModels).catch(() => {});
  }, []);

  useEffect(() => {
    if (modelIdParam && models.some((m) => m.id === modelIdParam)) {
      setSelectedModel(modelIdParam);
    }
  }, [modelIdParam, models]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || !selectedModel) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const { response } = await api.chat.send(selectedModel, msg);
      setMessages((prev) => [...prev, { role: "model", content: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Error: Could not get response from model." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Chat
        </h1>
        <p className="mt-1 text-slate-400">
          Talk to your fine-tuned model
        </p>
      </div>

      <GlassCard className="flex flex-col">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm text-slate-400">Model</label>
          <select
            className="glass-input w-auto min-w-[200px]"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="">Select model</option>
            {models.map((m) => (
              <option key={m.id} value={m.id} className="bg-slate-900">
                {m.base_model} ({m.id})
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex flex-1 flex-col">
          <div className="min-h-[320px] space-y-4 rounded-xl border border-white/5 bg-black/20 p-4">
            {messages.length === 0 && (
              <p className="text-center text-sm text-slate-500">
                Send a message to start the conversation.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    m.role === "user"
                      ? "bg-violet-500/30 text-white"
                      : "glass text-slate-200"
                  }`}
                >
                  <p className="text-xs font-medium text-slate-400">
                    {m.role === "user" ? "You" : "Model"}
                  </p>
                  <p className="mt-0.5 whitespace-pre-wrap text-sm">{m.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="glass rounded-2xl px-4 py-2.5">
                  <p className="text-xs text-slate-500">Thinking…</p>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="mt-4 flex gap-2"
          >
            <input
              type="text"
              className="glass-input flex-1"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!selectedModel || loading}
            />
            <button
              type="submit"
              disabled={!selectedModel || loading || !input.trim()}
              className="glass-button-primary disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="animate-fade-in p-8 text-slate-400">Loading…</div>}>
      <ChatContent />
    </Suspense>
  );
}
