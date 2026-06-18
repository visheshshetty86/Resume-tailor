function ResumeComparison({ originalResumeText, tailoredResume }) {
  if (!originalResumeText || !tailoredResume) {
    return null;
  }

  return (
    <section className="rounded-[20px] border border-[#252b34] bg-[#111418] p-6 shadow-panel">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a7b0bc]">
          Before vs After
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#a7b0bc]">
          Compare the original extracted resume text with the tailored version
          generated for the job description.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-[#252b34] bg-[#171b21] p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#748090]">
            Original Resume
          </p>
          <pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-[#f5f7fa]">
            {originalResumeText}
          </pre>
        </div>

        <div className="rounded-xl border border-[#252b34] bg-[#171b21] p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#4f8cff]">
            Tailored Resume
          </p>
          <pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-[#f5f7fa]">
            {tailoredResume}
          </pre>
        </div>
      </div>
    </section>
  );
}

export default ResumeComparison;
