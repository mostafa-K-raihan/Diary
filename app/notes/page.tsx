import path from 'path';
import { promises as fs } from 'fs';

async function walk(dir) {
  let files = await fs.readdir(dir);
  files = await Promise.all(files.map(async file => {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) return walk(filePath);
      else if(stats.isFile()) return filePath;
  }));

  return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

async function getNotes() {
  const dbDirectory = path.join(process.cwd(), 'db');
  const h = await walk(dbDirectory);
  const fileContents = await fs.readFile(dbDirectory + '/2023/July/18.md', 'utf8');
  return  { fileContents, h};
}


export default async function NotesPage() {
  const { fileContents: data, h} = await getNotes();
  return (
    <div>
      <h1>Notes</h1>
      <pre>{data}</pre>
      {h.map(a => {
        return <p key={a}>{a}</p>
      })}
    </div>
  )
}