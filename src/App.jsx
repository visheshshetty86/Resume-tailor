import AppShell from "./components/layout/AppShell";
import Header from "./components/layout/Header";
import ResumeUpload from "./components/resume/ResumeUpload";
import JobUrlInput from "./components/job/JobUrlInput";
import JobDescriptionInput from "./components/job/JobDescriptionInput";
import TailorButton from "./components/action/TailorButton";
import StatusPanel from "./components/StatusPanel";
import ProcessPreview from "./components/ProcessPreview";
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
    canTailor,
  } = useResumeTailor();

  return (
    <AppShell>
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl sm:p-8">
              <div className="mb-6 space-y-3">
                <span className="inline-flex w-fit items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-200">
                  Frontend only workflow
                </span>
                <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Tailor resumes to any job listing in a clean, focused workspace.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Upload a PDF resume, paste the job listing URL, and prepare a
                  tailored draft. The backend can plug in later without changing
                  the interface.
                </p>
              </div>

              <div className="grid gap-4">
                <ResumeUpload file={resumeFile} onChange={handleFileChange} />
                <JobUrlInput value={jobUrl} onChange={setJobUrl} />
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={setJobDescription}
                />
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
              </div>
            </div>

            <StatusPanel
              status={status}
              resumeFile={resumeFile}
              jobUrl={jobUrl}
              jobDetails={jobDetails}
              tailoredResume={tailoredResume}
            />
          </div>

          <ProcessPreview resumeFile={resumeFile} jobUrl={jobUrl} />
        </section>
      </main>
    </AppShell>
  );
}

export default App;
