import AppShell from "./components/layout/AppShell";
import Header from "./components/layout/Header";
import ResumeUpload from "./components/resume/ResumeUpload";
import JobUrlInput from "./components/job/JobUrlInput";
import JobDescriptionInput from "./components/job/JobDescriptionInput";
import TailorButton from "./components/action/TailorButton";
import StatusPanel from "./components/StatusPanel";
import ResumeComparison from "./components/ResumeComparison";
import useResumeTailor from "./hooks/useResumeTailor";

function App() {
  const {
    resumeFile,
    jobUrl,
    status,
    isProcessing,
    isDownloading,
    jobDetails,
    tailoredResume,
    jobDescription,
    setJobUrl,
    setJobDescription,
    handleFileChange,
    handleTailor,
    handleDownloadDocx,
    handleDownloadPdf,
    canTailor,
  } = useResumeTailor();

  return (
    <AppShell>
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-glow backdrop-blur-xl">
            <div className="border-b border-white/10 px-6 py-6 sm:px-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-200">
                  ATS-optimized resume flow
                </span>
                {/* <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  Responsive UI
                </span> */}
              </div>

              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Tailor resumes for a job listing without losing the original
                truth.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                Upload a PDF resume, paste a job URL or job description, and
                generate a cleaner ATS-friendly version with a before/after
                comparison and DOCX export.
              </p>
            </div>

            <div className="grid gap-4 px-6 py-6 sm:px-8">
              <ResumeUpload file={resumeFile} onChange={handleFileChange} />
              <div className="grid gap-4 xl:grid-cols-2">
                <JobUrlInput value={jobUrl} onChange={setJobUrl} />
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={setJobDescription}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <TailorButton
                  onClick={handleTailor}
                  disabled={!canTailor}
                  isProcessing={isProcessing}
                />
                <button
                  type="button"
                  onClick={handleDownloadDocx}
                  disabled={!tailoredResume || isDownloading}
                  className="inline-flex items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-500"
                >
                  {isDownloading ? "Preparing DOCX..." : "Download DOCX"}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={!tailoredResume || isDownloading}
                  className="inline-flex items-center justify-center rounded-2xl border border-sky-300/30 bg-sky-400/10 px-5 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-500"
                >
                  {isDownloading ? "Preparing PDF..." : "Download PDF"}
                </button>
              </div>
            </div>
          </div>

          <StatusPanel
            status={status}
            resumeFile={resumeFile}
            jobUrl={jobUrl}
            jobDetails={jobDetails}
            tailoredResume={tailoredResume}
          />

          <ResumeComparison
            originalResumeText={jobDetails?.resumeText || ""}
            tailoredResume={tailoredResume}
          />
        </section>
      </main>
    </AppShell>
  );
}

export default App;
