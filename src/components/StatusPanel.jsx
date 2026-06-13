function StatusPanel({ status, resumeFile, jobUrl }) {
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
    </section>
  );
}

export default StatusPanel;
