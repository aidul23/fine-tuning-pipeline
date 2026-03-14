const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || res.statusText);
  }
  return res.json();
}

export interface Dataset {
  id: string;
  name: string;
  file_path: string;
  created_at: string;
}

export interface Job {
  id: string;
  dataset_id: string;
  base_model: string;
  status: "Queued" | "Running" | "Completed" | "Failed";
  progress: number;
  created_at: string;
}

export interface Model {
  id: string;
  job_id: string;
  base_model: string;
  adapter_path: string;
  created_at: string;
}

export const api = {
  datasets: {
    list: () => request<Dataset[]>("/datasets"),
    upload: (formData: FormData) =>
      fetch(`${API_BASE}/datasets/upload`, {
        method: "POST",
        body: formData,
      }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText)))),
    delete: (id: string) =>
      request(`/datasets/${id}`, { method: "DELETE" }),
  },
  jobs: {
    list: () => request<Job[]>("/finetune/jobs"),
    get: (id: string) => request<Job>(`/finetune/jobs/${id}`),
    create: (body: {
      base_model: string;
      dataset_id: string;
      epochs: number;
      learning_rate: number;
      max_seq_length: number;
    }) =>
      request<{ job_id: string }>("/finetune/jobs", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  models: {
    list: () => request<Model[]>("/models"),
    download: (id: string) => `${API_BASE}/models/${id}/download`,
  },
  chat: {
    send: (modelId: string, message: string) =>
      request<{ response: string }>(`/chat/${modelId}`, {
        method: "POST",
        body: JSON.stringify({ message }),
      }),
  },
};
