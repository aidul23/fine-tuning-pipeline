"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { api, type Model } from "@/lib/api";
import { getPageIcon } from "@/lib/nav";

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.models.list().then(setModels).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Models"
        description="Fine-tuned models: chat or download"
        icon={getPageIcon("/models")}
      />

      <GlassCard>
        <h2 className="text-lg font-medium text-white">Available models</h2>
        <p className="mt-1 text-sm text-slate-400">
          Base model, dataset, metrics. Chat or download adapter/merged.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : models.length === 0 ? (
            <p className="text-sm text-slate-500">No fine-tuned models yet.</p>
          ) : (
            models.map((m) => (
              <div
                key={m.id}
                className="flex flex-col rounded-xl border border-white/5 bg-white/[0.02] p-4"
              >
                <p className="font-medium text-slate-200">{m.base_model}</p>
                <p className="mt-1 text-xs font-mono text-slate-500">
                  {m.id} · job {m.job_id}
                </p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/chat?model=${m.id}`}
                    className="glass-button-primary flex-1 text-center text-sm"
                  >
                    Chat
                  </Link>
                  <a
                    href={api.models.download(m.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button-ghost text-sm"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}
