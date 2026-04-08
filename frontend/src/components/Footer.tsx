export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/[0.06] bg-slate-900/40 px-6 py-4 backdrop-blur-sm lg:left-64 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Fine-Tuning Platform
        </p>
      </div>
    </footer>
  );
}
