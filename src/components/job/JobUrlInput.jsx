function JobUrlInput({ value, onChange }) {
  return (
    <label className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5">
      <div className="mb-3">
        <p className="text-sm font-medium text-slate-100">Job listing URL</p>
        <p className="mt-1 text-sm text-slate-400">
          Paste the role you want to tailor against.
        </p>
      </div>

      <input
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://company.com/jobs/..."
        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10"
      />
    </label>
  );
}

export default JobUrlInput;
