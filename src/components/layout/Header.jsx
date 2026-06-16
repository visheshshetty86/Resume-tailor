function Header() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/85">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-300/80">
            Resume Pilot
          </p>
          <h2 className="mt-1 text-sm font-medium text-slate-200 sm:text-base">
            Upload a resume, add a role, and generate a tighter tailored draft.
          </h2>
        </div>

        {/* <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 sm:block">
          Responsive component-based layout
        </div> */}
      </div>
    </header>
  );
}

export default Header;
