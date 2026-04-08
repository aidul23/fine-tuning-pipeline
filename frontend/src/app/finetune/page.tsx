"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { api, type Dataset } from "@/lib/api";
import { getPageIcon } from "@/lib/nav";

const BASE_MODELS = [
  "TinyLlama/TinyLlama-1.1B",
  "Qwen/Qwen-0.5B",
  "HuggingFaceTB/SmolLM-1B",
];

export default function FineTunePage() {
  const router = useRouter();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    base_model: BASE_MODELS[0],
    dataset_id: "",
    epochs: 3,
    learning_rate: 0.0002,
    max_seq_length: 1024,
  });

  useEffect(() => {
    api.datasets.list().then(setDatasets).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.dataset_id) return;
    setSubmitting(true);
    api.jobs
      .create({
        base_model: form.base_model,
        dataset_id: form.dataset_id,
        epochs: form.epochs,
        learning_rate: form.learning_rate,
        max_seq_length: form.max_seq_length,
      })
      .then(({ job_id }) => router.push(`/jobs?highlight=${job_id}`))
      .catch(() => {})
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Fine-Tune"
        description="Start a LoRA fine-tuning job"
        icon={getPageIcon("/finetune")}
      />

      <form onSubmit={onSubmit}>
        <GlassCard className="space-y-6">
          <h2 className="text-lg font-medium text-white">Training config</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm text-slate-400">Base model</label>
              <select
                className="glass-input"
                value={form.base_model}
                onChange={(e) =>
                  setForm((f) => ({ ...f, base_model: e.target.value }))
                }
              >
                {BASE_MODELS.map((m) => (
                  <option key={m} value={m} className="bg-slate-900 text-slate-200">
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-slate-400">Dataset</label>
              <select
                className="glass-input"
                value={form.dataset_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dataset_id: e.target.value }))
                }
                required
              >
                <option value="" className="bg-slate-900">
                  Select dataset
                </option>
                {datasets.map((ds) => (
                  <option
                    key={ds.id}
                    value={ds.id}
                    className="bg-slate-900 text-slate-200"
                  >
                    {ds.name || ds.id}
                  </option>
                ))}
              </select>
              {loading && (
                <p className="text-xs text-slate-500">Loading datasets…</p>
              )}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm text-slate-400">Epochs</label>
              <input
                type="number"
                min={1}
                max={20}
                className="glass-input"
                value={form.epochs}
                onChange={(e) =>
                  setForm((f) => ({ ...f, epochs: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-slate-400">Learning rate</label>
              <input
                type="number"
                step="0.0001"
                min={1e-6}
                className="glass-input"
                value={form.learning_rate}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    learning_rate: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-slate-400">
                Max sequence length
              </label>
              <input
                type="number"
                min={128}
                max={4096}
                step={128}
                className="glass-input"
                value={form.max_seq_length}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    max_seq_length: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting || !form.dataset_id}
              className="glass-button-primary disabled:opacity-50"
            >
              {submitting ? "Starting…" : "Start training"}
            </button>
          </div>
        </GlassCard>
      </form>
    </div>
  );
}
