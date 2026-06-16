function ResumeComparison({ originalResumeText, tailoredResume }) {
  if (!originalResumeText || !tailoredResume) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-950/75 p-6 shadow-panel">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
          Before vs After
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Compare the original extracted resume text with the tailored version
          generated for the job description.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
            Original Resume
          </p>
          <pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-100">
            {originalResumeText}
          </pre>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-200/70">
            Tailored Resume
          </p>
          <pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-100">
            {tailoredResume}
          </pre>
        </div>
      </div>
    </section>
  );
}

export default ResumeComparison;
