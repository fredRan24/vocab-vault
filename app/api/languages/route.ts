import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const languagesPath = path.join(process.cwd(), 'public', 'languages');

  try {
    const folders = fs.readdirSync(languagesPath);
    const languages = folders.filter((folder) =>
      fs.statSync(path.join(languagesPath, folder)).isDirectory()
    );

    return NextResponse.json({ languages });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load languages' }, { status: 500 });
  }
}
