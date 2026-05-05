# IDSR Liberia Prototype

A prototype for Integrated Disease Surveillance and Response (IDSR) in Liberia, built with Next.js and hosted on Vercel.

## Features

- **Clinic Reporting**: Simple form for clinics to report new cases of infectious diseases.
- **Admin Dashboard**: View all reported cases in a table.
- **Data Storage**: Uses Vercel Blob for storing case data as JSON.
- **Authentication Simulation**: Clinics are auto-assigned (currently hardcoded for demo).

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (optional):
   - `BLOB_READ_WRITE_TOKEN`: If set, uses Vercel Blob for storage (works locally and in production)
   - `BLOB_STORAGE_ACCESS`: Optional, `private` or `public`. Defaults to `private`.
   - If no token is set in development, uses local file storage in `data/cases.json`
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Pages

- `/`: Home page with navigation
- `/clinic`: Case reporting form
- `/admin`: Admin dashboard to view all cases

## Deployment

Deploy to Vercel by connecting your GitHub repository to Vercel. Ensure the `BLOB_READ_WRITE_TOKEN` environment variable is set in Vercel.

## Data Model

- Cases are stored with clinic ID, disease, county code, case ID, and timestamp.
- Clinics and diseases are currently hardcoded; integrate with provided spreadsheets for full data.

## Next Steps

- Import health facility data from spreadsheet
- Add IDSR county codes and case ID generation
- Implement proper authentication
- Add more fields to case reporting
- Enhance admin dashboard with filtering and export
