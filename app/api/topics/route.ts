import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getTopicsRecursively(dirPath: string, currentPath = ''): any {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  return entries
    .map((entry) => {
      const entryFullPath = path.join(dirPath, entry.name);
      const combinedPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        return {
          name: entry.name,
          type: 'directory',
          path: combinedPath,
          children: getTopicsRecursively(entryFullPath, combinedPath),
        };
      } else if (entry.isFile() && entry.name.endsWith('.txt')) {
        const baseName = entry.name.replace('.txt', '');
        const pathWithoutExt = combinedPath.replace('.txt', '');
        return {
          name: baseName,
          type: 'file',
          path: pathWithoutExt,
        };
      }
      return null;
    })
    .filter(Boolean);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const language = url.searchParams.get('language');

  if (!language) {
    return NextResponse.json({ error: 'Language is required' }, { status: 400 });
  }

  const rootDir = path.join(process.cwd(), 'public', 'languages', language);

  try {
    const topicsTree = getTopicsRecursively(rootDir);
    return NextResponse.json({ topics: topicsTree });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to load topics' }, { status: 500 });
  }
}
