import PDFDocument from "pdfkit";
import { parseResumeText } from "./resumeText.js";

const COLORS = {
  text: "#0f172a",
  muted: "#475569",
  accent: "#0f766e",
  line: "#dbe3ea",
  softLine: "#eef2f7",
  bullet: "#111827",
};

export async function createResumePdfBuffer(tailoredResumeText) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 48, bottom: 48, left: 48, right: 48 },
      bufferPages: true,
    });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const { headerLines, sections } = parseResumeText(tailoredResumeText);

    renderTitle(doc);
    renderHeader(doc, headerLines);
    renderDivider(doc);

    if (!sections.length) {
      doc.moveDown(1);
      doc.font("Helvetica").fontSize(10.5).fillColor(COLORS.text);
      doc.text("No tailored resume content was provided.");
      doc.end();
      return;
    }

    for (const section of sections) {
      renderSection(doc, section);
    }

    doc.end();
  });
}

function renderTitle(doc) {
  doc.font("Helvetica-Bold").fontSize(22).fillColor(COLORS.text);
  doc.text("Tailored Resume", { align: "center" });
}

function renderHeader(doc, headerLines) {
  if (!headerLines.length) {
    return;
  }

  doc.moveDown(0.35);

  const headerText = headerLines
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" | ");

  doc.font("Helvetica").fontSize(9.5).fillColor(COLORS.muted);
  doc.text(headerText, { align: "center", lineGap: 2 });
}

function renderDivider(doc) {
  doc.moveDown(0.5);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .strokeColor(COLORS.line)
    .lineWidth(1)
    .stroke();
  doc.moveDown(0.7);
}

function renderSection(doc, section) {
  ensureSpace(doc, 42);

  doc
    .font("Helvetica-Bold")
    .fontSize(11.5)
    .fillColor(COLORS.accent)
    .text(section.title.toUpperCase());

  doc
    .moveTo(doc.page.margins.left, doc.y + 3)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y + 3)
    .strokeColor(COLORS.softLine)
    .lineWidth(1)
    .stroke();

  doc.moveDown(0.35);

  for (const item of section.items) {
    renderItem(doc, item);
  }
}

function renderItem(doc, item) {
  const contentWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const heightHint = item.type === "bullet" ? 20 : 15;

  ensureSpace(doc, heightHint);

  doc.font("Helvetica").fontSize(10).fillColor(COLORS.bullet);

  if (item.type === "bullet") {
    doc.text(`- ${item.text}`, {
      width: contentWidth,
      indent: 10,
      paragraphGap: 4,
      lineGap: 3,
      continued: false,
    });
    return;
  }

  doc.text(item.text, {
    width: contentWidth,
    lineGap: 3,
    paragraphGap: 4,
  });
}

function ensureSpace(doc, heightNeeded) {
  const bottomLimit = doc.page.height - doc.page.margins.bottom;
  if (doc.y + heightNeeded > bottomLimit) {
    doc.addPage();
  }
}
