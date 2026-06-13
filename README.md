# Resume Tailor

A clean Vite + React + Tailwind frontend for a resume tailoring workflow.

Users can:
- Upload a resume PDF
- Paste a job listing URL
- Paste a job description manually when a site blocks extraction
- Trigger a "Tailor Resume" action

This is frontend only for now. The UI is structured so a backend can be added later without changing the overall layout.

## Tech Stack

- React
- Vite
- Tailwind CSS

## Features

- Responsive modern UI
- Separate reusable components
- Local front-end state for upload and URL input
- Ready for future API integration

## Project Structure

- `src/components/layout` for the app shell and header
- `src/components/resume` for the resume upload component
- `src/components/job` for the job listing URL input
- `src/components/action` for the primary CTA button
- `src/components` for shared panels and previews
- `src/hooks` for local UI logic

## Getting Started

```bash
npm install
npm run dev
```

## Backend

Run the simple Express server for PDF upload and extraction:

```bash
npm run server
```

POST a PDF file to `/upload-resume` using the form field name `resume`.

To extract a LinkedIn or Naukri job post, send JSON to `/extract-job`:

```json
{ "url": "https://www.linkedin.com/jobs/view/..." }
```

The response shape is:

```json
{
  "title": "Job title",
  "company": "Company name",
  "description": "Job description text"
}
```

If extraction fails, the API returns a meaningful `error` message and a 4xx/5xx status code.

To tailor a resume with OpenAI, send JSON to `/tailor-resume`:

```json
{
  "resumeText": "Extracted resume text",
  "jobDescription": "Job description text"
}
```

Response:

```json
{
  "tailoredResume": "Tailored resume text"
}
```

To generate a downloadable DOCX from the tailored resume text, send JSON to `/download-tailored-resume-docx`:

```json
{
  "tailoredResume": "Tailored resume text"
}
```

The response is a downloadable `.docx` file.

To generate a downloadable PDF from the tailored resume text, send JSON to `/download-tailored-resume-pdf`:

```json
{
  "tailoredResume": "Tailored resume text"
}
```

The response is a downloadable `.pdf` file.

Environment variables:

- `OPENAI_API_KEY` is required
- `OPENAI_MODEL` is optional, defaulting to `gpt-5.4-mini`

Create a local `.env` file in the project root with the same keys:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.4-mini
```

## Available Scripts

- `npm run dev` starts the local development server
- `npm run server` starts the Express API
- `npm run build` creates a production build
- `npm run preview` previews the production build locally

## Notes

- The resume upload accepts PDF files only
- If LinkedIn or Naukri blocks URL extraction, paste the job description manually
- The manual job-description field overrides URL extraction when filled
