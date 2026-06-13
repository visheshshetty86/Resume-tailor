import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";

export async function createResumeDocxBuffer(tailoredResumeText) {
  const sections = buildSections(tailoredResumeText);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Tailored Resume",
                bold: true,
                size: 30,
                color: "111827",
              }),
            ],
            spacing: { after: 220 },
          }),
          ...sections,
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

function buildSections(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const paragraphs = [];

  for (const line of lines) {
    if (isHeading(line)) {
      paragraphs.push(
        new Paragraph({
          text: normalizeHeading(line),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 120 },
        })
      );
      continue;
    }

    if (isBullet(line)) {
      paragraphs.push(
        new Paragraph({
          text: normalizeBullet(line),
          bullet: { level: 0 },
          spacing: { after: 40 },
        })
      );
      continue;
    }

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: 22,
          }),
        ],
        spacing: { after: 80 },
      })
    );
  }

  return paragraphs.length
    ? paragraphs
    : [
        new Paragraph({
          text: "No tailored resume content was provided.",
          italics: true,
          spacing: { after: 80 },
        }),
      ];
}

function isHeading(line) {
  return /^(summary|professional summary|experience|work experience|skills|education|projects|certifications|achievements|profile|objective)[:\s]*$/i.test(
    line
  ) || /^[A-Z][A-Z\s/&-]{2,}$/.test(line);
}

function normalizeHeading(line) {
  return line.replace(/[:\s]+$/, "");
}

function isBullet(line) {
  return /^[-*•]\s+/.test(line);
}

function normalizeBullet(line) {
  return line.replace(/^[-*•]\s+/, "");
}
