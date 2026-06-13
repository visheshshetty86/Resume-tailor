import express from "express";
import cors from "cors";
import multer from "multer";
import pdfParse from "pdf-parse";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = process.env.PORT || 3001;

app.use(cors());

app.get("/", (_req, res) => {
  res.json({ message: "Resume Tailor API is running." });
});

app.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    const isPdf =
      req.file.mimetype === "application/pdf" ||
      req.file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return res.status(400).json({ error: "Only PDF files are allowed." });
    }

    const data = await pdfParse(req.file.buffer);

    return res.json({
      text: data.text,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to extract text from the PDF.",
    });
  }
});

app.listen(port, () => {
  console.log(`Resume Tailor server running on http://localhost:${port}`);
});
