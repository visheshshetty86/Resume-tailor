const STANDARD_HEADINGS = new Set([
  "summary",
  "professional summary",
  "experience",
  "work experience",
  "skills",
  "education",
  "projects",
  "certifications",
  "achievements",
  "profile",
  "objective",
  "contact",
]);

export function sanitizeTailoredResumeText(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.filter((line) => !isBadStandaloneLabel(line)).join("\n").trim();
}

export function isResumeHeading(line) {
  const normalized = normalizeLine(line);
  return STANDARD_HEADINGS.has(normalized) || /^[A-Z][A-Z\s/&-]{2,}$/.test(line);
}

export function normalizeResumeHeading(line) {
  return line.replace(/[:\s]+$/, "");
}

export function isResumeBullet(line) {
  return /^[-*•]\s+/.test(line);
}

export function normalizeResumeBullet(line) {
  return line.replace(/^[-*•]\s+/, "");
}

function isBadStandaloneLabel(line) {
  if (!/^[A-Za-z][A-Za-z0-9\s/&-]{0,30}:$/.test(line)) {
    return false;
  }

  return !STANDARD_HEADINGS.has(normalizeLine(line));
}

function normalizeLine(line) {
  return line.replace(/[:\s]+$/, "").toLowerCase();
}
