import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directories exist
const AUDIO_DIR = path.join(__dirname, '../public/assets/audio');
const MAP_PATH = path.join(__dirname, '../src/utils/audioMap.js');

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

const envLocalPath = path.join(__dirname, '../.env.local');
let apiKey = process.env.VITE_ELEVENLABS_API_KEY;
if (!apiKey && fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  const match = envContent.match(/VITE_ELEVENLABS_API_KEY=(.*)/);
  if (match) apiKey = match[1].trim();
}

const phrases = [
  { text: "Let's master regrouping!", style: 'encouragement' },
  { text: "Learn to carry in addition and borrow in subtraction! Solve puzzles with place value blocks, unlock treasure, and become a regrouping master!", style: 'statement' },
  { text: "Hmm... I wonder...", style: 'thinking' },
  { text: "You have 27 marbles and your friend gives you 15 more. The ones column adds up to 12! But a column can only hold 9. What do you do?", style: 'question' },
  { text: "When a column adds up to more than 9, we regroup — we carry the extra ten to the next column!", style: 'statement' },
  { text: "You have 43 stickers but want to give away 18. You can't take 8 from 3! How can you solve this?", style: 'question' },
  { text: "When we can't subtract, we borrow — we break a ten into ten ones!", style: 'statement' },
  { text: "A baker has 56 cupcakes and makes 37 more. How does he figure out the total when 6 + 7 = 13?", style: 'question' },
  { text: "He writes down the 3 and carries the 1 ten to the tens column. That's regrouping!", style: 'statement' },
  { text: "You have 32 apples, but need to give 15 to a friend. Can you take 5 from 2?", style: 'question' },
  { text: "No! You need to borrow a ten. The 3 tens becomes 2 tens, and the 2 ones becomes 12 ones!", style: 'statement' },
  { text: "What happens when you add 48 + 36? The ones column gives you 14. Where does the extra 10 go?", style: 'question' },
  { text: "The 10 gets carried up to the tens column. That is called carrying or regrouping!", style: 'statement' },
  { text: "John, Mike, Sarah, and Priya discover a glowing treasure map hidden inside the school library! But the map is locked with math puzzles. To unlock each piece, they must master the ancient art of Regrouping!", style: 'statement' },
  { text: "\"To find the treasure, we must learn to regroup!\"", style: 'emphasis' },
  { text: "Mike explains: \"Every number has columns! The Ones column is for single blocks. The Tens column is for rods of ten. The Hundreds column is for big flats of one hundred. When we add or subtract, we work column by column!\"", style: 'statement' },
  { text: "\"Ones → Tens → Hundreds — each column has its place!\"", style: 'emphasis' },
  { text: "Sarah shows everyone: \"When we add 27 + 15, the ones column gives us 7 + 5 = 12. But 12 is too many for one column! So we keep the 2 ones and carry the 1 ten to the tens column. That is called carrying or regrouping in addition!\"", style: 'statement' },
  { text: "\"7 + 5 = 12 → Write 2, carry 1 ten!\"", style: 'emphasis' },
  { text: "\"But what about subtraction?\" asks Priya. \"When we solve 42 − 17, we can't take 7 from 2! So we borrow a ten from the tens column. The 4 tens become 3 tens, and the 2 ones become 12 ones. Now we can subtract: 12 − 7 = 5!\"", style: 'statement' },
  { text: "\"Can't subtract? Borrow a ten! 42 − 17 = 25\"", style: 'emphasis' },
  { text: "John says: \"Now we must cross the Practice Bridge! Each stone has a regrouping puzzle. We need to carry when adding and borrow when subtracting. If we get them right, the bridge lights up and we get closer to the treasure!\"", style: 'statement' },
  { text: "\"Practice makes perfect — carry and borrow!\"", style: 'emphasis' },
  { text: "Now you know the secrets of regrouping! When digits add up to more than 9, we carry. When we can't subtract, we borrow. The treasure awaits those who master these skills. Are you ready to begin your quest?", style: 'statement' },
  { text: "\"Carry in addition, borrow in subtraction — let's go!\"", style: 'emphasis' },
  { text: "Addition with Carrying. Let's solve it step by step!", style: 'statement' },
  { text: "Subtraction with Borrowing. Can we take it away? Let's find out!", style: 'statement' },
  { text: "Number Sentence. Solve the problem using what you've learned!", style: 'statement' },
  { text: "Teach the mascot what you learned about regrouping!", style: 'statement' },
  { text: "How do you feel about regrouping? Be honest — every answer is great!", style: 'statement' },
  { text: "Incredible! You are a Regrouping Master!", style: 'celebration' },
  { text: "Great effort! Keep practicing carrying and borrowing!", style: 'encouragement' },
  { text: "Good start! Try again to improve!", style: 'encouragement' }
];

async function generate() {
  if (!apiKey) {
    console.error("No VITE_ELEVENLABS_API_KEY found in .env.local");
    return;
  }

  let audioMap = {};
  if (fs.existsSync(MAP_PATH)) {
    const rawMap = fs.readFileSync(MAP_PATH, 'utf-8');
    const mapStr = rawMap.replace('export default ', '').replace(';', '');
    try {
      audioMap = eval('(' + mapStr + ')');
    } catch (e) {}
  }

  let updatedMap = { ...audioMap };

  for (const phrase of phrases) {
    const textHash = crypto.createHash('md5').update(phrase.text).digest('hex');
    const filename = `audio_${textHash}.mp3`;
    const filepath = path.join(AUDIO_DIR, filename);

    if (fs.existsSync(filepath) && updatedMap[phrase.text]) {
      continue; // Already generated
    }

    console.log(`Generating audio for: "${phrase.text.substring(0, 30)}..."`);
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: phrase.text,
          model_id: 'eleven_multilingual_v2',
        })
      });

      if (!response.ok) throw new Error('API error: ' + response.statusText);

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filepath, buffer);

      updatedMap[phrase.text] = `/assets/audio/${filename}`;
    } catch (err) {
      console.error(`Failed for text: ${phrase.text}`, err);
    }
  }

  fs.writeFileSync(MAP_PATH, `export default ${JSON.stringify(updatedMap, null, 2)};\n`);
  console.log("Audio map updated.");
}

generate();
