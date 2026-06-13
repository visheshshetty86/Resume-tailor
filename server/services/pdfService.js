import PDFDocument from "pdfkit";
import {
  isResumeBullet,
  isResumeHeading,
  normalizeResumeBullet,
  normalizeResumeHeading,
  sanitizeTailoredResumeText,
} from "./resumeText.js";

export async function createResumePdfBuffer(tailoredResumeText) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 54, bottom: 54, left: 54, right: 54 },
      bufferPages: true,
    });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor("#111827")
      .text("Tailored Resume", { align: "center" });

    doc.moveDown(0.8);
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#6b7280")
      .text("Generated from the tailored resume text", { align: "center" });

    doc.moveDown(1.2);

    const lines = sanitizeTailoredResumeText(tailoredResumeText)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      doc
        .fontSize(11)
        .fillColor("#111827")
        .text("No tailored resume content was provided.");
      doc.end();
      return;
    }

    for (const line of lines) {
      if (isResumeHeading(line)) {
        doc.moveDown(0.4);
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor("#0f172a")
          .text(normalizeResumeHeading(line), { continued: false });
        doc.moveDown(0.2);
        continue;
      }

      if (isResumeBullet(line)) {
        doc
          .font("Helvetica")
          .fontSize(10.5)
          .fillColor("#111827")
          .list([normalizeResumeBullet(line)], { bulletIndent: 14, textIndent: 6 });
        continue;
      }

      doc
        .font("Helvetica")
        .fontSize(10.5)
        .fillColor("#111827")
        .text(line, {
          lineGap: 2,
          paragraphGap: 6,
        });
    }

    doc.end();
  });
}
