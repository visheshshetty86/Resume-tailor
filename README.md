# Resume Tailor

A clean Vite + React + Tailwind frontend for a resume tailoring workflow.

Users can:
- Upload a resume PDF
- Paste a job listing URL
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

## Available Scripts

- `npm run dev` starts the local development server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally

## Notes

- The resume upload accepts PDF files only
- The tailoring action is currently a UI placeholder
- No backend is connected yet
