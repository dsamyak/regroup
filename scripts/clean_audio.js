import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIO_DIR = path.join(__dirname, '../public/assets/audio');
const MAP_PATH = path.join(__dirname, '../src/utils/audioMap.js');

if (!fs.existsSync(MAP_PATH)) {
  console.error("audioMap.js not found.");
  process.exit(1);
}

const rawMap = fs.readFileSync(MAP_PATH, 'utf-8');
const mapStr = rawMap.replace('export default ', '').replace(';', '');
let audioMap = {};
try {
  audioMap = eval('(' + mapStr + ')');
} catch (e) {
  console.error("Failed to parse audioMap.js");
  process.exit(1);
}

const activeFiles = new Set(Object.values(audioMap).map(p => path.basename(p)));

let deletedCount = 0;
if (fs.existsSync(AUDIO_DIR)) {
  const files = fs.readdirSync(AUDIO_DIR);
  for (const file of files) {
    if (file.endsWith('.mp3') && !activeFiles.has(file)) {
      fs.unlinkSync(path.join(AUDIO_DIR, file));
      deletedCount++;
    }
  }
}

console.log(`Cleaned up ${deletedCount} unused audio files.`);
