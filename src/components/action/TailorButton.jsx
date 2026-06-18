function TailorButton({ onClick, disabled, isProcessing }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-lg bg-[#4f8cff] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,140,255,0.18)] transition duration-200 hover:bg-[#4379e6] disabled:cursor-not-allowed disabled:bg-[#2a3340] disabled:text-[#6f7782] disabled:shadow-none"
    >
      {isProcessing ? "Tailoring..." : "Tailor Resume"}
    </button>
  );
}

export default TailorButton;
