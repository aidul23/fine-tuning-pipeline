"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { api, type Job } from "@/lib/api";

function JobsContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [jobDetail, setJobDetail] = useState<Job | null>(null);

  const load = () => {
    api.jobs
      .list()
      .then(setJobs)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!selected) {
      setJobDetail(null);
      return;
    }
    api.jobs.get(selected).then(setJobDetail).catch(() => setJobDetail(null));
  }, [selected]);

  const statusColor = (status: Job["status"]) =>
    status === "Completed"
      ? "bg-emerald-500/20 text-emerald-400"
      : status === "Running"
        ? "bg-amber-500/20 text-amber-400"
        : status === "Failed"
          ? "bg-red-500/20 text-red-400"
          : "bg-slate-500/20 text-slate-400";

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Jobs
        </h1>
        <p className="mt-1 text-slate-400">
          Training job status, logs, and metrics
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h2 className="text-lg font-medium text-white">All jobs</h2>
          <div className="mt-4 space-y-2">
            {loading ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : jobs.length === 0 ? (
              <p className="text-sm text-slate-500">No jobs yet.</p>
            ) : (
              jobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelected(job.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                    selected === job.id || highlightId === job.id
                      ? "border-violet-500/40 bg-violet-500/10"
                      : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <div>
                    <p className="font-medium text-slate-200">{job.base_model}</p>
                    <p className="text-xs text-slate-500">
                      {job.id} · {job.dataset_id}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(job.status)}`}
                  >
                    {job.status}
                  </span>
                </button>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-medium text-white">Job details</h2>
          {!selected ? (
            <p className="mt-4 text-sm text-slate-500">
              Select a job to see details and logs.
            </p>
          ) : jobDetail ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 font-mono text-sm">
                <p><span className="text-slate-500">id:</span> {jobDetail.id}</p>
                <p><span className="text-slate-500">base_model:</span> {jobDetail.base_model}</p>
                <p><span className="text-slate-500">dataset_id:</span> {jobDetail.dataset_id}</p>
                <p><span className="text-slate-500">status:</span> {jobDetail.status}</p>
                <p><span className="text-slate-500">progress:</span> {jobDetail.progress}%</p>
                <p><span className="text-slate-500">created_at:</span> {jobDetail.created_at}</p>
              </div>
              <p className="text-xs text-slate-500">
                Training logs and metrics will appear here when the worker reports them.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Loading details…</p>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="animate-fade-in p-8 text-slate-400">Loading…</div>}>
      <JobsContent />
    </Suspense>
  );
}
