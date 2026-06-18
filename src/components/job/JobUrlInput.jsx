function JobUrlInput({ value, onChange }) {
  return (
    <label className="rounded-[18px] border border-[#252b34] bg-[#171b21] p-5">
      <div className="mb-3">
        <p className="text-sm font-medium text-[#f5f7fa]">Job listing URL</p>
        <p className="mt-1 text-sm text-[#a7b0bc]">
          Paste the role you want to tailor against.
        </p>
      </div>

      <input
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://company.com/jobs/..."
        className="w-full rounded-lg border border-[#252b34] bg-[#111418] px-4 py-3 text-sm text-[#f5f7fa] outline-none transition duration-200 placeholder:text-[#748090] focus:border-[#4f8cff]/70 focus:ring-2 focus:ring-[#4f8cff]/12"
      />
    </label>
  );
}

export default JobUrlInput;
