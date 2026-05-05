import { NextRequest, NextResponse } from 'next/server';
import { put, get } from '@vercel/blob';
import { Case } from '@/types';
import fs from 'fs';
import path from 'path';

const CASES_FILE = 'cases.json';
const LOCAL_DATA_PATH = path.join(process.cwd(), 'data', 'cases.json');
const BLOB_ACCESS = process.env.BLOB_STORAGE_ACCESS || 'private';

async function getCases(): Promise<Case[]> {
  const useBlob = process.env.BLOB_READ_WRITE_TOKEN;

  if (!useBlob && process.env.NODE_ENV === 'development') {
    try {
      if (fs.existsSync(LOCAL_DATA_PATH)) {
        const data = fs.readFileSync(LOCAL_DATA_PATH, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch {
      return [];
    }
  } else if (useBlob) {
    try {
      const result = await get(CASES_FILE, {
        access: BLOB_ACCESS as 'private' | 'public'
      });
      if (!result || result.statusCode !== 200 || !result.stream) {
        return [];
      }
      const response = new Response(result.stream);
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch {
      return [];
    }
  }

  return [];
}

async function saveCases(cases: Case[]): Promise<void> {
  const useBlob = process.env.BLOB_READ_WRITE_TOKEN;

  if (!useBlob && process.env.NODE_ENV === 'development') {
    const dir = path.dirname(LOCAL_DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DATA_PATH, JSON.stringify(cases, null, 2));
  } else if (useBlob) {
    await put(CASES_FILE, JSON.stringify(cases), {
      access: BLOB_ACCESS as 'private' | 'public'
    });
  } else {
    throw new Error('BLOB_READ_WRITE_TOKEN is required for production deployment');
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