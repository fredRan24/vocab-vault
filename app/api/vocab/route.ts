import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const language = url.searchParams.get('language');
  const topic = url.searchParams.get('topic');

  if (!language || !topic) {
    return NextResponse.json({ error: 'Language and Topic are required' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'languages', language, `${topic}.txt`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const vocab = fileContent
      .split('\n')
      .map((line) => line.split(','))
      .filter((row) => row.length === 2)
      .map(([languageA, languageB]) => ({
        languageA: languageA.trim(),
        languageB: languageB.trim(),
      }));

    const shuffled = vocab.sort(() => Math.random() - 0.5);

    return NextResponse.json({ vocab: shuffled });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load vocabulary' }, { status: 500 });
  }
}
