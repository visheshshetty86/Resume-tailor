const OPENAI_API_URL = "https://api.openai.com/v1/responses";

export async function tailorResumeWithOpenAI({ resumeText, jobDescription }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";
  const instructions = [
    "You are an expert technical recruiter.",
    "Given a resume and a job description, optimize the resume for ATS systems.",
    "Never invent experience, projects, or skills.",
    "Never invent metrics, dates, employers, certifications, or responsibilities.",
    "Reorder and rephrase existing experience to improve relevance to the job description.",
    "Highlight relevant achievements that already exist in the resume.",
    "Use keywords from the job description only when they genuinely match existing experience.",
    "Preserve truthfulness at all times.",
    "Return a professional resume with clear section headings.",
  ].join(" ");

  const userInput = [
    "RESUME TEXT:",
    resumeText.trim(),
    "",
    "JOB DESCRIPTION:",
    jobDescription.trim(),
  ].join("\n");

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions,
      input: userInput,
      temperature: 0.2,
      max_output_tokens: 1200,
    }),
  });

  const payload = await readJsonSafe(response);

  if (!response.ok) {
    const message =
      payload?.error?.message ||
      payload?.error ||
      `OpenAI request failed with status ${response.status}.`;

    throw new Error(message);
  }

  const tailoredResume = extractResponseText(payload);

  if (!tailoredResume) {
    throw new Error("OpenAI returned no resume text.");
  }

  return tailoredResume.trim();
}

async function readJsonSafe(response) {
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

function extractResponseText(payload) {
  if (!payload) {
    return null;
  }

  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  const output = payload.output;
  if (!Array.isArray(output)) {
    return null;
  }

  const textChunks = [];

  for (const item of output) {
    const content = item?.content;
    if (!Array.isArray(content)) {
      continue;
    }

    for (const part of content) {
      if (typeof part?.text === "string") {
        textChunks.push(part.text);
      }
    }
  }

  const joined = textChunks.join("\n").trim();
  return joined || null;
}
