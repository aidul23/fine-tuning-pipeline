"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { api, type Dataset } from "@/lib/api";
import { getPageIcon } from "@/lib/nav";

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadName, setUploadName] = useState("");

  const load = () => {
    api.datasets
      .list()
      .then(setDatasets)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (uploadName.trim()) fd.append("name", uploadName.trim());
      await api.datasets.upload(fd);
      setUploadName("");
      form.reset();
      load();
    } catch {
      // show error in UI if needed
    } finally {
      setUploading(false);
    }
  };

  const deleteDataset = (id: string) => {
    if (!confirm("Delete this dataset?")) return;
    api.datasets.delete(id).then(load).catch(() => {});
  };

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Datasets"
        description="Upload and manage JSONL instruction datasets"
        icon={getPageIcon("/datasets")}
      />

      <GlassCard>
        <h2 className="text-lg font-medium text-white">Upload dataset</h2>
        <p className="mt-1 text-sm text-slate-400">
          JSONL with <code className="rounded bg-white/10 px-1 font-mono text-xs">instruction</code>,{" "}
          <code className="rounded bg-white/10 px-1 font-mono text-xs">input</code>,{" "}
          <code className="rounded bg-white/10 px-1 font-mono text-xs">output</code>
        </p>
        <form onSubmit={onUpload} className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <label className="block text-sm text-slate-400">Name (optional)</label>
            <input
              type="text"
              className="glass-input"
              placeholder="My dataset"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="block text-sm text-slate-400">File</label>
            <input
              type="file"
              accept=".jsonl,.json"
              className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-slate-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="glass-button-primary disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </form>
      </GlassCard>

      <GlassCard>
        <h2 className="text-lg font-medium text-white">Your datasets</h2>
        <p className="mt-1 text-sm text-slate-400">Preview and delete</p>
        <div className="mt-4 space-y-2">
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : datasets.length === 0 ? (
            <p className="text-sm text-slate-500">No datasets yet. Upload one above.</p>
          ) : (
            datasets.map((ds) => (
              <div
                key={ds.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-200">{ds.name || ds.id}</p>
                  <p className="text-xs font-mono text-slate-500">{ds.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteDataset(ds.id)}
                  className="glass-button-ghost text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}
