function ResumeComparison({ originalResumeText, tailoredResume }) {
  if (!originalResumeText || !tailoredResume) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white">Before vs After</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Compare the original extracted resume text with the tailored version
          generated for the job description.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Original Resume
          </p>
          <pre className="mt-3 max-h-[460px] overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-100">
            {originalResumeText}
          </pre>
        </div>

        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
            Tailored Resume
          </p>
          <pre className="mt-3 max-h-[460px] overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-100">
            {tailoredResume}
          </pre>
        </div>
      </div>
    </section>
  );
}

export default ResumeComparison;
