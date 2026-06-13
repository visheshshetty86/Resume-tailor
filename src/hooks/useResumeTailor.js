import { useMemo, useState } from "react";

function useResumeTailor() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobUrl, setJobUrl] = useState("");
  const [status, setStatus] = useState(
    "Upload a resume PDF and paste a job listing URL to prepare a tailored draft."
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);

  const canTailor = useMemo(
    () => Boolean(resumeFile && jobUrl.trim() && !isProcessing),
    [resumeFile, jobUrl, isProcessing]
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

    setIsProcessing(true);
    setStatus("Sending resume and job URL to the server...");
    setJobDetails(null);

    void (async () => {
      try {
        const resumeFormData = new FormData();
        resumeFormData.append("resume", resumeFile);

        const resumeResponse = await fetch("/api/upload-resume", {
          method: "POST",
          body: resumeFormData,
        });

        const resumePayload = await readApiResponse(resumeResponse);

        if (!resumeResponse.ok) {
          throw new Error(resumePayload?.error || "Failed to upload resume.");
        }

        const jobResponse = await fetch("/api/extract-job", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: jobUrl.trim() }),
        });

        const jobPayload = await readApiResponse(jobResponse);

        if (!jobResponse.ok) {
          throw new Error(jobPayload?.error || "Failed to extract job details.");
        }

        setJobDetails({
          resumeText: resumePayload.text,
          title: jobPayload.title,
          company: jobPayload.company,
          description: jobPayload.description,
        });
        setStatus("Resume and job details loaded successfully. Ready for tailoring logic.");
      } catch (error) {
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          setStatus(
            "Could not reach the backend server. Make sure `npm run server` is running on port 3001."
          );
        } else {
          setStatus(error instanceof Error ? error.message : "Something went wrong.");
        }
      } finally {
        setIsProcessing(false);
      }
    })();
  };

  return {
    resumeFile,
    jobUrl,
    status,
    isProcessing,
    jobDetails,
    setJobUrl,
    handleFileChange,
    handleTailor,
    canTailor,
  };
}

export default useResumeTailor;

async function readApiResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}
