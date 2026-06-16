import { sanitizeTailoredResumeText } from "./resumeText.js";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const STAGE_1_PROMPT =
  "Analyze the job description and extract required skills, preferred skills, technologies, keywords, and responsibilities. Compare them against the resume. Identify matching skills, matching technologies, relevant experience sections, and keywords that are missing from the resume and therefore cannot be added. Return valid JSON only.";
const STAGE_2_SYSTEM_PROMPT = [
  "You are a professional resume writer and ATS optimization specialist.",
  "",
  "Your task is to produce only the final tailored resume.",
  "",
  "Rules:",
  "",
  "* Use only information present in the resume.",
  "* Use the job description and Stage 1 analysis only to prioritize and rewrite existing content.",
  "* Never invent experience, projects, skills, technologies, certifications, achievements, responsibilities, qualifications, employers, dates, or metrics.",
  "* Reorganize content to maximize relevance for the target role.",
  "* Do not generate any section that is not part of the resume.",
  "* Do not add ATS sections, keyword sections, targeting notes, recommendations, suggestions, analysis, observations, or follow-up text.",
  "* Rewrite bullet points with stronger action verbs and clearer language.",
  "* Improve ATS keyword alignment only when supported by the resume.",
  "* Remove redundant or low-value content when appropriate.",
  "* Keep the resume concise, professional, and recruiter-friendly.",
  "",
  "Output Rules:",
  "",
  "* Return only the resume.",
  "* The final output must be a resume only.",
  "* Do not include commentary.",
  "* Do not include explanations.",
  "* Do not include recommendations.",
  "* Do not include notes.",
  "* Do not include summaries.",
  "* Do not include ATS analysis.",
  "* Do not include keyword lists.",
  "* Do not include alignment reports.",
  "* Do not include targeting notes.",
  "* Do not include follow-up suggestions.",
  "* Do not include ATS alignment.",
  "* Do not include ATS keyword alignment.",
  "* Do not include phrases such as:",
  "",
  '  * "If you want"',
  '  * "I can also"',
  '  * "Strong match"',
  '  * "ATS optimized"',
  '  * "Alignment summary"',
  '  * "Targeting notes"',
  "* The response must end immediately after the final resume section.",
  "* No text is allowed after the resume ends.",
  "",
  "Return only the final resume.",
].join("\n");

export async function tailorResumeWithOpenAI({ resumeText, jobDescription }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";
  const stage1Input = buildStage1Input({ resumeText, jobDescription });
  const stage1Payload = await callOpenAI({
    apiKey,
    model,
    instructions: buildStage1Instructions(),
    input: stage1Input,
    temperature: 0,
    max_output_tokens: 800,
  });
  const stage1Analysis = parseStage1Analysis(stage1Payload);

  const stage2Input = buildStage2Input({
    resumeText,
    jobDescription,
    stage1Analysis,
  });
  const stage2Payload = await callOpenAI({
    apiKey,
    model,
    instructions: buildStage2Instructions(),
    input: stage2Input,
    temperature: 0.2,
    max_output_tokens: 1400,
  });

  const tailoredResume = normalizeResumeOutput(extractResponseText(stage2Payload));

  if (!tailoredResume) {
    throw new Error("OpenAI returned no resume text.");
  }

  return sanitizeTailoredResumeText(tailoredResume);
}

function buildStage1Instructions() {
  return STAGE_1_PROMPT;
}

function buildStage1Input({ resumeText, jobDescription }) {
  return [
    "RESUME TEXT:",
    resumeText.trim(),
    "",
    "JOB DESCRIPTION:",
    jobDescription.trim(),
    "",
    "Return JSON with keys:",
    "required_skills",
    "preferred_skills",
    "technologies",
    "keywords",
    "responsibilities",
    "matching_skills",
    "matching_technologies",
    "relevant_experience_sections",
    "missing_keywords_not_in_resume",
  ].join("\n");
}

function buildStage2Instructions() {
  return STAGE_2_SYSTEM_PROMPT;
}

function buildStage2Input({ resumeText, jobDescription, stage1Analysis }) {
  return [
    "RESUME TEXT:",
    resumeText.trim(),
    "",
    "JOB DESCRIPTION:",
    jobDescription.trim(),
    "",
    "STAGE 1 ANALYSIS JSON:",
    JSON.stringify(stage1Analysis, null, 2),
  ].join("\n");
}

function normalizeResumeOutput(text) {
  if (!text || typeof text !== "string") {
    return null;
  }

  let cleaned = text
    .replace(/^\uFEFF/, "")
    .replace(/^\s*Tailored Resume\s*$/gim, "")
    .replace(/^\s*(?:Tailored Resume|ATS-OPTIMIZED|TARGETING NOTES|ATS NOTES|ATS OPTIMIZED NOTES|ATS KEYWORDS|ATS ALIGNMENT NOTES|ATS TARGETING NOTES|ATS ALIGNMENT|ATS KEYWORD ALIGNMENT|ATS OPTIMIZED KEYWORDS MATCHED TO EXPERIENCE|RECOMMENDATIONS|SUGGESTIONS|ANALYSIS|OBSERVATIONS)\b.*(?:\r?\n|$)/gim, "")
    .replace(/^\s*#{1,6}\s+/gim, "")
    .replace(/^\s*---+\s*$/gim, "")
    .replace(/^\s*Notes?:.*$/gim, "");

  cleaned = cleaned
  .replace(/ATS[- ]?OPTIMIZED ALIGNMENT SUMMARY[\s\S]*$/i, "")
.replace(/STRONG MATCH[\s\S]*$/i, "")
.replace(/IF YOU WANT[\s\S]*$/i, "")
.replace(/I CAN ALSO[\s\S]*$/i, "")
  .replace(/ATS-OPTIMIZED[\s\S]*$/i, "")
  .replace(/ATS[- ]?ALIGNED[\s\S]*$/i, "")
  .replace(/ATS[- ]?OPTIMIZED PROFILE SUMMARY[\s\S]*$/i, "")
  .replace(/ATS[- ]?OPTIMIZED KEYWORDS MATCHED TO EXPERIENCE[\s\S]*$/i, "")
  .replace(/TARGETING NOTES[\s\S]*$/i, "")
  .replace(/If you want[\s\S]*$/i, "")
  .replace(/I can also[\s\S]*$/i, "")
    .split(/\r?\n/)
    .filter((line, index, lines) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return true;
      }

      const leadingLabel = trimmed.match(/^(Tailored Resume|ATS-OPTIMIZED|TARGETING NOTES|ATS NOTES|ATS OPTIMIZED NOTES|ATS KEYWORDS|ATS ALIGNMENT NOTES|ATS TARGETING NOTES|ATS ALIGNMENT|ATS KEYWORD ALIGNMENT|RECOMMENDATIONS|SUGGESTIONS|ANALYSIS|OBSERVATIONS)\b/i);
      if (leadingLabel) {
        return false;
      }

      const markdownHeading = /^#{1,6}\s+/.test(trimmed);
      if (markdownHeading) {
        return false;
      }

      return true;
    })
    .join("\n")
    .trim();

  return cleaned || null;
}

async function callOpenAI({ apiKey, model, instructions, input, temperature, max_output_tokens }) {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions,
      input,
      temperature,
      max_output_tokens,
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

  return payload;
}

function parseStage1Analysis(payload) {
  const text = normalizeResumeOutput(extractResponseText(payload));

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start >= 0 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return { raw_analysis: text };
      }
    }

    return { raw_analysis: text };
  }
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
