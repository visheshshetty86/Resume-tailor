function StatusPanel({ status, resumeFile, jobUrl, jobDetails, tailoredResume }) {
  return (
    <section className="rounded-[20px] border border-[#252b34] bg-[#111418] p-5 shadow-panel sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a7b0bc]">
        Current state
      </h3>
      <p className="mt-3 text-sm leading-6 text-[#f5f7fa]">{status}</p>

      <dl className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[#252b34] bg-[#171b21] p-4">
          <dt className="text-[11px] uppercase tracking-[0.22em] text-[#748090]">
            Resume
          </dt>
          <dd className="mt-2 break-words text-sm text-[#f5f7fa]">
            {resumeFile ? resumeFile.name : "Waiting for upload"}
          </dd>
        </div>
        <div className="rounded-xl border border-[#252b34] bg-[#171b21] p-4">
          <dt className="text-[11px] uppercase tracking-[0.22em] text-[#748090]">
            Job URL
          </dt>
          <dd className="mt-2 break-all text-sm text-[#f5f7fa]">
            {jobUrl || "Waiting for URL"}
          </dd>
        </div>
      </dl>

      {jobDetails ? (
        <div className="mt-4 grid gap-4 rounded-xl border border-[#252b34] bg-[#171b21] p-4 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#a7b0bc]">
              Source
            </p>
            <p className="mt-2 text-sm text-[#f5f7fa]">
              {jobDetails.source === "manual" ? "Manual paste" : "URL extract"}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#a7b0bc]">
              Title
            </p>
            <p className="mt-2 text-sm text-[#f5f7fa]">{jobDetails.title || "Not found"}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#a7b0bc]">
              Company
            </p>
            <p className="mt-2 text-sm text-[#f5f7fa]">{jobDetails.company || "Not found"}</p>
          </div>
          <div className="sm:col-span-2 xl:col-span-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#a7b0bc]">
              Description
            </p>
            <p className="mt-2 max-h-48 overflow-auto text-sm leading-6 text-[#d4d9e0]">
              {jobDetails.description}
            </p>
          </div>
        </div>
      ) : null}

      {tailoredResume ? (
        <div className="mt-4 rounded-xl border border-[#252b34] bg-[#171b21] p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#22c55e]">
            Tailored Resume
          </p>
          <pre className="mt-3 max-h-[24rem] overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-[#f5f7fa]">
            {tailoredResume}
          </pre>
        </div>
      ) : null}
    </section>
  );
}

export default StatusPanel;
