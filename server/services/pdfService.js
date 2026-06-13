import PDFDocument from "pdfkit";

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

    doc.font("Helvetica-Bold")
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

    const lines = String(tailoredResumeText || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      doc.fontSize(11).fillColor("#111827").text("No tailored resume content was provided.");
      doc.end();
      return;
    }

    for (const line of lines) {
      if (isHeading(line)) {
        doc.moveDown(0.4);
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor("#0f172a")
          .text(normalizeHeading(line), { continued: false });
        doc.moveDown(0.2);
        continue;
      }

      if (isBullet(line)) {
        doc
          .font("Helvetica")
          .fontSize(10.5)
          .fillColor("#111827")
          .list([normalizeBullet(line)], { bulletIndent: 14, textIndent: 6 });
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
