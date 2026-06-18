function ResumeUpload({ file, onChange }) {
  return (
    <label className="group flex cursor-pointer flex-col gap-3 rounded-[18px] border border-dashed border-[#303844] bg-[#171b21] p-5 transition duration-200 hover:border-[#4f8cff]/55 hover:bg-[#1a1f26]">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#252b34] bg-[#111418] text-sm font-semibold text-[#f5f7fa]">
          PDF
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#f5f7fa]">Resume PDF upload</p>
          <p className="mt-1 text-sm leading-6 text-[#a7b0bc]">
            Drop in a PDF or click to browse.
          </p>
          <p className="mt-2 text-xs text-[#748090]">
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

      <div className="rounded-xl border border-[#252b34] bg-[#111418] px-4 py-3 text-sm text-[#a7b0bc]">
        {file ? (
          <div className="flex items-center justify-between gap-3">
            <span className="truncate font-medium text-[#f5f7fa]">{file.name}</span>
            <span className="shrink-0 text-xs text-[#22c55e]">Ready</span>
          </div>
        ) : (
          <span>No file selected yet</span>
        )}
      </div>
    </label>
  );
}

export default ResumeUpload;
