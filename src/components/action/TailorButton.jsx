function TailorButton({ onClick, disabled, isProcessing }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
    >
      {isProcessing ? "Tailoring..." : "Tailor Resume"}
    </button>
  );
}

export default TailorButton;
