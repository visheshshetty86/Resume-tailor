function JobDescriptionInput({ value, onChange }) {
  return (
    <label className="rounded-[18px] border border-[#252b34] bg-[#171b21] p-5">
      <div className="mb-3">
        <p className="text-sm font-medium text-[#f5f7fa]">Paste job description</p>
        <p className="mt-1 text-sm text-[#a7b0bc]">
          Use this when the site blocks URL extraction. It overrides the URL if filled.
        </p>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste the full job description here if LinkedIn or Naukri blocks extraction..."
        rows={8}
        className="w-full resize-y rounded-lg border border-[#252b34] bg-[#111418] px-4 py-3 text-sm leading-6 text-[#f5f7fa] outline-none transition duration-200 placeholder:text-[#748090] focus:border-[#4f8cff]/70 focus:ring-2 focus:ring-[#4f8cff]/12"
      />
    </label>
  );
}

export default JobDescriptionInput;
