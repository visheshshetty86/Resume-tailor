import { AlignmentType, Document, Packer, Paragraph, TextRun } from "docx";
import { parseResumeText } from "./resumeText.js";

export async function createResumeDocxBuffer(tailoredResumeText) {
  const { headerLines, sections } = parseResumeText(tailoredResumeText);

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 20,
            color: "111827",
          },
          paragraph: {
            spacing: { line: 276, after: 0 },
          },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "Tailored Resume",
                bold: true,
                size: 32,
                color: "0F172A",
                font: "Arial",
              }),
            ],
          }),
          ...renderHeader(headerLines),
          ...renderSections(sections),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

function renderHeader(headerLines) {
  if (!headerLines.length) {
    return [];
  }

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: headerLines.join(" | "),
          bold: true,
          size: 20,
          color: "334155",
          font: "Arial",
        }),
      ],
    }),
  ];
}

function renderSections(sections) {
  const paragraphs = [];

  for (const section of sections) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 160, after: 90 },
        border: {
          bottom: {
            color: "D9E2EC",
            space: 1,
            style: "single",
            size: 6,
          },
        },
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            size: 22,
            color: "0F766E",
            font: "Arial",
          }),
        ],
      })
    );

    for (const item of section.items) {
      if (item.type === "bullet") {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            indent: { left: 360, hanging: 180 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: item.text,
                size: 20,
                font: "Arial",
                color: "111827",
              }),
            ],
          })
        );
        continue;
      }

      paragraphs.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: item.text,
              size: 20,
              font: "Arial",
              color: "111827",
            }),
          ],
        })
      );
    }
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
