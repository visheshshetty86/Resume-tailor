import { useMemo, useState } from "react";

function useResumeTailor() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobUrl, setJobUrl] = useState("");
  const [status, setStatus] = useState(
    "Upload a resume PDF and paste a job listing URL to prepare a tailored draft."
  );

  const canTailor = useMemo(
    () => Boolean(resumeFile && jobUrl.trim()),
    [resumeFile, jobUrl]
  );

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] ?? null;

    if (!selectedFile) {
      setResumeFile(null);
      setStatus(
        "Upload a resume PDF and paste a job listing URL to prepare a tailored draft."
      );
      return;
    }

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.endsWith(".pdf")
    ) {
      setResumeFile(null);
      setStatus("Please choose a PDF file for the resume upload.");
      return;
    }

    setResumeFile(selectedFile);
    setStatus(
      `Loaded ${selectedFile.name}. Add a job listing URL to continue.`
    );
  };

  const handleTailor = () => {
    if (!canTailor) {
      setStatus("Upload a PDF resume and add a valid job URL before tailoring.");
      return;
    }

    setStatus(
      `Ready to tailor ${resumeFile.name} for the provided job listing. Backend integration can be added next.`
    );
  };

  return {
    resumeFile,
    jobUrl,
    status,
    setJobUrl,
    handleFileChange,
    handleTailor,
    canTailor,
  };
}

export default useResumeTailor;
