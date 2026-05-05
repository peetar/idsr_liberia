import { NextRequest, NextResponse } from 'next/server';
import { put, head } from '@vercel/blob';
import { Case } from '@/types';
import fs from 'fs';
import path from 'path';

const CASES_FILE = 'cases.json';
const LOCAL_DATA_PATH = path.join(process.cwd(), 'data', 'cases.json');

async function getCases(): Promise<Case[]> {
  const useBlob = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (useBlob) {
    // Use Vercel Blob if token is available
    try {
      const blob = await head(CASES_FILE);
      if (!blob) return [];
      const response = await fetch(blob.url);
      return await response.json();
    } catch {
      return [];
    }
  } else {
    // Use local file if no token
    try {
      if (fs.existsSync(LOCAL_DATA_PATH)) {
        const data = fs.readFileSync(LOCAL_DATA_PATH, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch {
      return [];
    }
  }
}

async function saveCases(cases: Case[]): Promise<void> {
  const useBlob = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (useBlob) {
    // Use Vercel Blob if token is available
    await put(CASES_FILE, JSON.stringify(cases), { access: 'public' });
  } else {
    // Use local file if no token
    const dir = path.dirname(LOCAL_DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DATA_PATH, JSON.stringify(cases, null, 2));
  }
}

export async function GET() {
  const cases = await getCases();
  return NextResponse.json(cases);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { clinicId, disease, countyCode, caseId } = body;

  if (!clinicId || !disease || !countyCode || !caseId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const cases = await getCases();
  const newCase: Case = {
    id: Date.now().toString(),
    clinicId,
    disease,
    reportedAt: new Date().toISOString(),
    countyCode,
    caseId,
  };
  cases.push(newCase);
  await saveCases(cases);

  return NextResponse.json(newCase, { status: 201 });
}