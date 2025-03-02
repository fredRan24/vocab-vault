import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const language = url.searchParams.get('language');

  if (!language) {
    return NextResponse.json({ error: 'Language is required' }, { status: 400 });
  }

  const directory = path.join(process.cwd(), 'public', 'languages', language);

  try {
    const files = fs.readdirSync(directory);
    const topics = files
      .filter((file) => file.endsWith('.txt'))
      .map((file) => file.replace('.txt', ''));

    return NextResponse.json({ topics });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load topics' }, { status: 500 });
  }
}
