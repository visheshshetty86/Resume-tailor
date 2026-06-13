function ProcessPreview({ resumeFile, jobUrl }) {
  const steps = [
    {
      title: "Upload resume",
      detail: resumeFile ? "File captured locally" : "Select a PDF to begin",
    },
    {
      title: "Add job URL",
      detail: jobUrl ? "Listing URL saved" : "Paste a role link",
    },
    {
      title: "Tailor later",
      detail: "Backend logic can be connected without reworking the UI",
    },
  ];

  return (
    <aside className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
      <h3 className="text-base font-semibold text-white">Workspace preview</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        A lightweight front-end shell for resume tailoring, built to scale into
        the API layer later.
      </p>

      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-semibold text-cyan-300">
              {index + 1}
            </div>
            <div>
              <p className="font-medium text-white">{step.title}</p>
              <p className="mt-1 text-sm text-slate-400">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default ProcessPreview;
