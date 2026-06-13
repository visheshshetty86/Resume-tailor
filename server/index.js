import express from "express";
import cors from "cors";
import multer from "multer";
import pdfParse from "pdf-parse";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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

app.post("/extract-job", async (req, res) => {
  try {
    const url = typeof req.body?.url === "string" ? req.body.url.trim() : "";

    if (!url) {
      return res.status(400).json({
        error: "Missing URL. Provide a LinkedIn or Naukri job URL in the request body.",
      });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({
        error: "Invalid URL. Provide a full LinkedIn or Naukri job URL.",
      });
    }
    const hostname = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();
    const isLinkedIn = hostname.endsWith("linkedin.com");
    const isNaukri = hostname.endsWith("naukri.com");

    if (!isLinkedIn && !isNaukri) {
      return res.status(400).json({
        error: "Unsupported URL. Only LinkedIn or Naukri job URLs are allowed.",
      });
    }

    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      return res.status(502).json({
        error: `Failed to fetch job page. Upstream responded with ${response.status}.`,
      });
    }

    const html = await response.text();
    const extracted = extractJobDetails(html);

    if (!extracted.description) {
      return res.status(422).json({
        error:
          "Could not extract a job description from this page. The site may block automated fetching or the page structure may differ.",
        title: extracted.title || null,
        company: extracted.company || null,
      });
    }

    return res.json({
      title: extracted.title || null,
      company: extracted.company || null,
      description: extracted.description,
    });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to extract job details from the provided URL.",
    });
  }
});

app.listen(port, () => {
  console.log(`Resume Tailor server running on http://localhost:${port}`);
});

function extractJobDetails(html) {
  const jsonLd = extractJobPostingFromJsonLd(html);
  const title =
    cleanText(jsonLd?.title) ||
    cleanText(extractMetaContent(html, "og:title")) ||
    cleanText(extractMetaContent(html, "twitter:title")) ||
    cleanText(extractTitleTag(html));
  const company =
    cleanText(jsonLd?.hiringOrganization?.name) ||
    cleanText(extractCompanyFromKnownPatterns(html)) ||
    null;
  const description =
    cleanText(jsonLd?.description) ||
    cleanText(extractMetaContent(html, "og:description")) ||
    cleanText(extractMetaContent(html, "twitter:description")) ||
    cleanText(extractDescriptionFromKnownPatterns(html)) ||
    null;

  return { title, company, description };
}

function extractJobPostingFromJsonLd(html) {
  const scripts = html.match(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );

  if (!scripts) {
    return null;
  }

  for (const script of scripts) {
    const content = script.replace(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>|<\/script>/gi,
      ""
    );

    try {
      const parsed = JSON.parse(content);
      const candidate = findJobPosting(parsed);
      if (candidate) {
        return candidate;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function findJobPosting(value) {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findJobPosting(item);
      if (found) return found;
    }
    return null;
  }

  if (typeof value !== "object") {
    return null;
  }

  const type = value["@type"];
  if (type === "JobPosting" || (Array.isArray(type) && type.includes("JobPosting"))) {
    return value;
  }

  if (value["@graph"]) {
    return findJobPosting(value["@graph"]);
  }

  return null;
}

function extractMetaContent(html, property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(
    new RegExp(
      `<meta[^>]*(?:property|name)=["']${escaped}["'][^>]*content=["']([^"']+)["'][^>]*>`,
      "i"
    )
  );

  return match?.[1] || null;
}

function extractTitleTag(html) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || null;
}

function extractDescriptionFromKnownPatterns(html) {
  const selectors = [
    /<div[^>]*class=["'][^"']*description[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    /<section[^>]*class=["'][^"']*description[^"']*["'][^>]*>([\s\S]*?)<\/section>/i,
    /<span[^>]*class=["'][^"']*description[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
  ];

  for (const pattern of selectors) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return stripHtml(match[1]);
    }
  }

  return null;
}

function extractCompanyFromKnownPatterns(html) {
  const selectors = [
    /<a[^>]*class=["'][^"']*company[^"']*["'][^>]*>([\s\S]*?)<\/a>/i,
    /<span[^>]*class=["'][^"']*company[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
    /<div[^>]*class=["'][^"']*company[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const pattern of selectors) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return stripHtml(match[1]);
    }
  }

  return null;
}

function stripHtml(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanText(value) {
  if (typeof value !== "string") {
    return null;
  }

  const text = stripHtml(value);
  return text || null;
}
