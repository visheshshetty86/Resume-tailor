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
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => normalizeResumeLine(line))
    .filter(Boolean);

  return lines.filter((line) => !isBadStandaloneLabel(line)).join("\n").trim();
}

export function parseResumeText(text) {
  const lines = sanitizeTailoredResumeText(text)
    .split("\n")
    .map((line) => normalizeResumeLine(line))
    .filter(Boolean);

  const headerLines = [];
  const sections = [];
  let currentSection = null;
  let foundFirstHeading = false;

  for (const line of lines) {
    if (isResumeHeading(line)) {
      foundFirstHeading = true;
      currentSection = { title: normalizeResumeHeading(line), items: [] };
      sections.push(currentSection);
      continue;
    }

    const isBullet = isResumeBullet(line);
    const item = {
      type: isBullet ? "bullet" : "text",
      text: isBullet ? normalizeResumeBullet(line) : line,
    };

    if (!foundFirstHeading) {
      headerLines.push(item.text);
      continue;
    }

    if (!currentSection) {
      currentSection = { title: "Additional Information", items: [] };
      sections.push(currentSection);
    }

    currentSection.items.push(item);
  }

  return {
    headerLines,
    sections,
  };
}

export function isResumeHeading(line) {
  const normalized = normalizeLine(line);
  return STANDARD_HEADINGS.has(normalized) || /^[A-Z][A-Z\s/&-]{2,}$/.test(line);
}

export function normalizeResumeHeading(line) {
  return normalizeResumeLine(line).replace(/[:\s]+$/, "");
}

export function isResumeBullet(line) {
  return /^[-*\u2022\u00b7\u2013\u2014]\s+/.test(line) || /^\d+[.)]\s+/.test(line);
}

export function normalizeResumeBullet(line) {
  return normalizeResumeLine(line)
    .replace(/^[-*\u2022\u00b7\u2013\u2014]\s+/, "")
    .replace(/^\d+[.)]\s+/, "");
}

function isBadStandaloneLabel(line) {
  const cleaned = normalizeResumeLine(line);

  if (!/^[A-Za-z][A-Za-z0-9\s/&-]{0,30}:$/.test(cleaned)) {
    return false;
  }

  return !STANDARD_HEADINGS.has(normalizeLine(cleaned));
}

function normalizeLine(line) {
  return normalizeResumeLine(line).replace(/[:\s]+$/, "").toLowerCase();
}

function normalizeResumeLine(line) {
  return String(line || "")
    .replace(/\u00A0/g, " ")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/^\s*#{1,6}\s*/, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/^(\s*)[*\u2022\u00b7\u2013\u2014]\s+/, "$1- ")
    .replace(/^(\s*)\d+[.)]\s+/, "$1- ")
    .replace(/\s+/g, " ")
    .trim();
}
