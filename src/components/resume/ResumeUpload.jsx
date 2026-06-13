function ResumeUpload({ file, onChange }) {
  return (
    <label className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-dashed border-cyan-300/25 bg-slate-900/70 p-5 transition hover:border-cyan-300/50 hover:bg-slate-900">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          PDF
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white">Resume PDF upload</p>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Drop in a PDF or click to browse.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Accepted format: `.pdf`
          </p>
        </div>
      </div>

      <input
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={onChange}
      />

      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
        {file ? (
          <div className="flex items-center justify-between gap-3">
            <span className="truncate font-medium text-white">{file.name}</span>
            <span className="shrink-0 text-xs text-cyan-300">Ready</span>
          </div>
        ) : (
          <span>No file selected yet</span>
        )}
      </div>
    </label>
  );
}

export default ResumeUpload;
