import PDFDocument from "pdfkit";
import { parseResumeText } from "./resumeText.js";

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

    const { headerLines, sections } = parseResumeText(tailoredResumeText);

    doc.font("Helvetica-Bold").fontSize(22).fillColor("#0f172a");
    doc.text("Tailored Resume", { align: "center" });

    if (headerLines.length) {
      doc.moveDown(0.35);
      doc.font("Helvetica").fontSize(9.5).fillColor("#4b5563");
      doc.text(headerLines.join("  •  "), { align: "center" });
    }

    doc.moveDown(0.5);
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .strokeColor("#d1d5db")
      .lineWidth(1)
      .stroke();

    doc.moveDown(0.7);

    if (!sections.length) {
      doc.font("Helvetica").fontSize(11).fillColor("#111827");
      doc.text("No tailored resume content was provided.");
      doc.end();
      return;
    }

    for (const section of sections) {
      ensureSpace(doc, 26);
      doc.moveDown(0.2);
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#0f766e")
        .text(section.title.toUpperCase());

      doc
        .moveTo(doc.page.margins.left, doc.y + 2)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y + 2)
        .strokeColor("#e5e7eb")
        .lineWidth(0.8)
        .stroke();

      doc.moveDown(0.3);

      for (const item of section.items) {
        ensureSpace(doc, item.type === "bullet" ? 18 : 14);

        if (item.type === "bullet") {
          const startX = doc.page.margins.left + 10;
          doc
            .font("Helvetica")
            .fontSize(10.5)
            .fillColor("#111827")
            .text("•", startX, doc.y, { continued: false });
          doc.text(item.text, startX + 12, doc.y - 10, {
            width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 18,
            lineGap: 2,
          });
          doc.moveDown(0.25);
          continue;
        }

        doc
          .font("Helvetica")
          .fontSize(10.5)
          .fillColor("#111827")
          .text(item.text, {
            lineGap: 2,
            paragraphGap: 5,
          });
      }
    }

    doc.end();
  });
}

function ensureSpace(doc, heightNeeded) {
  const bottomLimit = doc.page.height - doc.page.margins.bottom;
  if (doc.y + heightNeeded > bottomLimit) {
    doc.addPage();
  }
}
