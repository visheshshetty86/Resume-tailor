function StatusPanel({ status, resumeFile, jobUrl, jobDetails, tailoredResume }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h3 className="text-base font-semibold text-white">Current state</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{status}</p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Resume
          </dt>
          <dd className="mt-2 break-words text-sm text-white">
            {resumeFile ? resumeFile.name : "Waiting for upload"}
          </dd>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Job URL
          </dt>
          <dd className="mt-2 break-all text-sm text-white">
            {jobUrl || "Waiting for URL"}
          </dd>
        </div>
      </dl>

      {jobDetails ? (
        <div className="mt-4 grid gap-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">
              Title
            </p>
            <p className="mt-2 text-sm text-white">{jobDetails.title || "Not found"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">
              Company
            </p>
            <p className="mt-2 text-sm text-white">{jobDetails.company || "Not found"}</p>
          </div>
          <div className="sm:col-span-3">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">
              Description
            </p>
            <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-200">
              {jobDetails.description}
            </p>
          </div>
        </div>
      ) : null}

      {tailoredResume ? (
        <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
            Tailored Resume
          </p>
          <pre className="mt-3 max-h-[420px] whitespace-pre-wrap break-words text-sm leading-6 text-slate-100">
            {tailoredResume}
          </pre>
        </div>
      ) : null}
    </section>
  );
}

export default StatusPanel;
