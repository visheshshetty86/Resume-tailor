function Header() {
  return (
    <header className="border-b border-[#252b34] bg-[#0b0d10]/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#4f8cff]/85">
            Resume Pilot
          </p>
          <h2 className="text-sm font-medium text-[#a7b0bc] sm:text-base">
            Upload a resume, add a role, and generate a polished tailored draft.
          </h2>
        </div>

        {/* <div className="hidden rounded-full border border-[#252b34] bg-[#111418] px-3 py-1 text-xs text-[#a7b0bc] sm:block">
          Recruiter-ready workflow
        </div> */}
      </div>
    </header>
  );
}

export default Header;
