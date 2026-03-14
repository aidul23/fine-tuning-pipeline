"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { api, type Dataset, type Job, type Model } from "@/lib/api";

export default function DashboardPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.datasets.list(), api.jobs.list(), api.models.list()])
      .then(([d, j, m]) => {
        setDatasets(d);
        setJobs(j);
        setModels(m);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: "Datasets",
      value: loading ? "—" : datasets.length,
      href: "/datasets",
      icon: "◇",
    },
    {
      label: "Training jobs",
      value: loading ? "—" : jobs.length,
      href: "/jobs",
      icon: "▣",
    },
    {
      label: "Fine-tuned models",
      value: loading ? "—" : models.length,
      href: "/models",
      icon: "⬡",
    },
  ];

  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-slate-400">
          Overview of your fine-tuning platform
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <GlassCard hover className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{s.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {s.value}
                  </p>
                </div>
                <span className="text-2xl text-slate-600">{s.icon}</span>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      <GlassCard>
        <h2 className="text-lg font-medium text-white">Recent activity</h2>
        <p className="mt-1 text-sm text-slate-400">Latest training jobs</p>
        <div className="mt-4 space-y-2">
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : recentJobs.length === 0 ? (
            <p className="text-sm text-slate-500">No jobs yet.</p>
          ) : (
            recentJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-200">{job.base_model}</p>
                  <p className="text-xs text-slate-500">
                    {job.dataset_id} · {job.status}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    job.status === "Completed"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : job.status === "Running"
                        ? "bg-amber-500/20 text-amber-400"
                        : job.status === "Failed"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-slate-500/20 text-slate-400"
                  }`}
                >
                  {job.status}
                </span>
              </div>
            ))
          )}
        </div>
        <Link
          href="/jobs"
          className="mt-4 inline-block text-sm font-medium text-violet-400 hover:text-violet-300"
        >
          View all jobs →
        </Link>
      </GlassCard>
    </div>
  );
}
