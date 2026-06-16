function JobDescriptionInput({ value, onChange }) {
  return (
    <label className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5">
      <div className="mb-3">
        <p className="text-sm font-medium text-slate-100">Paste job description</p>
        <p className="mt-1 text-sm text-slate-400">
          Use this when the site blocks URL extraction. It overrides the URL if filled.
        </p>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste the full job description here if LinkedIn or Naukri blocks extraction..."
        rows={8}
        className="w-full resize-y rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10"
      />
    </label>
  );
}

export default JobDescriptionInput;
