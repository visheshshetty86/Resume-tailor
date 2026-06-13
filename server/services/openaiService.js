const OPENAI_API_URL = "https://api.openai.com/v1/responses";

export async function tailorResumeWithOpenAI({ resumeText, jobDescription }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const instructions = [
    "You are a resume tailoring assistant.",
    "Rewrite the resume so it is better aligned to the job description.",
    "Keep all factual information unchanged.",
    "Do not fabricate experience, employers, dates, degrees, certifications, metrics, or skills.",
    "Only rewrite the summary and experience wording to emphasize matching skills that already exist in the resume.",
    "If a fact is missing from the resume, omit it.",
    "Preserve the original resume's truthfulness and structure as much as possible.",
    "Return only the tailored resume text, with clear section headings.",
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
