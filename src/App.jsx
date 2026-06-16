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

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 shadow-panel">
            <div className="border-b border-slate-800/80 px-5 py-5 sm:px-7 sm:py-6">
              <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-200">
                Resume tailoring workspace
              </div>

              <h1 className="max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Tailor a resume with cleaner hierarchy and sharper relevance.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Upload a PDF resume, add a job URL or description, and generate
                a focused draft with side-by-side review and DOCX/PDF export.
              </p>
            </div>

            <div className="grid gap-4 px-5 py-5 sm:px-7 sm:py-6">
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
                  className="inline-flex items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/8 px-5 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/16 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
                >
                  {isDownloading ? "Preparing DOCX..." : "Download DOCX"}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={!tailoredResume || isDownloading}
                  className="inline-flex items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/8 px-5 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-400/16 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
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
