import { useMemo, useState } from "react";

function useResumeTailor() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState(
    "Upload a resume PDF and paste a job listing URL to prepare a tailored draft."
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const [tailoredResume, setTailoredResume] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const canTailor = useMemo(
    () => Boolean(resumeFile && (jobUrl.trim() || jobDescription.trim()) && !isProcessing),
    [resumeFile, jobUrl, jobDescription, isProcessing]
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
      setStatus(
        "Upload a PDF resume and add a job URL or paste a job description before tailoring."
      );
      return;
    }

    setIsProcessing(true);
    setStatus("Sending resume to the server...");
    setJobDetails(null);
    setTailoredResume("");

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

        let jobPayload = null;
        const manualJobDescription = jobDescription.trim();

        if (manualJobDescription) {
          jobPayload = {
            title: null,
            company: null,
            description: manualJobDescription,
            source: "manual",
          };
        } else {
          setStatus("Extracting job details from the URL...");

          const jobResponse = await fetch("/api/extract-job", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: jobUrl.trim() }),
          });

          jobPayload = await readApiResponse(jobResponse);

          if (!jobResponse.ok) {
            throw new Error(jobPayload?.error || "Failed to extract job details.");
          }
        }

        setJobDetails({
          resumeText: resumePayload.text,
          title: jobPayload.title,
          company: jobPayload.company,
          description: jobPayload.description,
          source: jobPayload.source || "url",
        });

        setStatus("Generating tailored resume...");

        const tailorResponse = await fetch("/api/tailor-resume", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeText: resumePayload.text,
            jobDescription: jobPayload.description,
          }),
        });

        const tailorPayload = await readApiResponse(tailorResponse);

        if (!tailorResponse.ok) {
          throw new Error(tailorPayload?.error || "Failed to tailor resume.");
        }

        setTailoredResume(tailorPayload.tailoredResume || "");
        setStatus(
          manualJobDescription
            ? "Tailored resume generated successfully from pasted job description."
            : "Tailored resume generated successfully from extracted job description."
        );
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

  const handleDownloadDocx = async () => {
    if (!tailoredResume.trim()) {
      setStatus("Generate a tailored resume before downloading DOCX.");
      return;
    }

    setIsDownloading(true);
    setStatus("Preparing DOCX download...");

    try {
      const response = await fetch("/api/download-tailored-resume-docx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tailoredResume }),
      });

      if (!response.ok) {
        const payload = await readApiResponse(response);
        throw new Error(payload?.error || "Failed to generate DOCX.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "tailored-resume.docx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);

      setStatus("DOCX file downloaded successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to download DOCX.");
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    resumeFile,
    jobUrl,
    jobDescription,
    status,
    isProcessing,
    isDownloading,
    jobDetails,
    tailoredResume,
    setJobUrl,
    setJobDescription,
    handleFileChange,
    handleTailor,
    handleDownloadDocx,
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
