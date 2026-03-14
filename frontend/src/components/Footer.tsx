export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-slate-900/40 px-6 py-4 backdrop-blur-sm lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Fine-Tuning Platform
        </p>
      </div>
    </footer>
  );
}
