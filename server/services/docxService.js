import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import {
  isResumeBullet,
  isResumeHeading,
  normalizeResumeBullet,
  normalizeResumeHeading,
  sanitizeTailoredResumeText,
} from "./resumeText.js";

export async function createResumeDocxBuffer(tailoredResumeText) {
  const sections = buildSections(sanitizeTailoredResumeText(tailoredResumeText));

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
    if (isResumeHeading(line)) {
      paragraphs.push(
        new Paragraph({
          text: normalizeResumeHeading(line),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 120 },
        })
      );
      continue;
    }

    if (isResumeBullet(line)) {
      paragraphs.push(
        new Paragraph({
          text: normalizeResumeBullet(line),
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
