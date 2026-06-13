function Header() {
  return (
    <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-300/80">
            Resume Tailor
          </p>
          <h2 className="text-lg font-semibold text-white">
            Vite + Tailwind frontend
          </h2>
        </div>

        <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 sm:block">
          Responsive component-based layout
        </div>
      </div>
    </header>
  );
}

export default Header;
