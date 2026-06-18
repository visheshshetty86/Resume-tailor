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

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="space-y-5">
          <div className="overflow-hidden rounded-[20px] border border-[#252b34] bg-[#111418] shadow-panel">
            <div className="border-b border-[#252b34] px-6 py-6 sm:px-8 sm:py-7">
              <div className="mb-4 inline-flex items-center rounded-full border border-[#252b34] bg-[#171b21] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[#a7b0bc]">
                Resume tailoring workspace
              </div>

              <h1 className="max-w-2xl text-2xl font-semibold tracking-tight text-[#f5f7fa] sm:text-3xl">
                Build a Stronger Resume for Every Role
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#a7b0bc]">
                Upload a PDF resume, add a job URL or description, and generate
                a focused draft with side-by-side review and DOCX/PDF export.
              </p>
            </div>

            <div className="grid gap-4 px-6 py-6 sm:px-8 sm:py-7">
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
                  className="inline-flex items-center justify-center rounded-lg border border-[#252b34] bg-[#171b21] px-5 py-3 text-sm font-semibold text-[#f5f7fa] transition duration-200 hover:bg-[#1d222a] disabled:cursor-not-allowed disabled:border-[#252b34] disabled:bg-[#111418] disabled:text-[#6f7782]"
                >
                  {isDownloading ? "Preparing DOCX..." : "Download DOCX"}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={!tailoredResume || isDownloading}
                  className="inline-flex items-center justify-center rounded-lg border border-[#252b34] bg-[#171b21] px-5 py-3 text-sm font-semibold text-[#f5f7fa] transition duration-200 hover:bg-[#1d222a] disabled:cursor-not-allowed disabled:border-[#252b34] disabled:bg-[#111418] disabled:text-[#6f7782]"
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
