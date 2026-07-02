import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, 'public', 'images', 'menu')

// Read the API key from the MCP config (avoids hardcoding the secret here)
const mcp = JSON.parse(fs.readFileSync(path.join(__dirname, '.kiro', 'settings', 'mcp.json'), 'utf8'))
const API_KEY = mcp.mcpServers.gemini.env.GEMINI_API_KEY
const MODEL = 'gemini-2.5-flash-image'
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`

const STYLE =
  ' — ultra-premium product photograph, centered, seamless dark charcoal (#0A0906) background, ' +
  'warm golden side-lighting, soft shadows, shallow depth of field, elegant minimal Parisian café ' +
  'aesthetic, moody and cinematic, photorealistic, high detail, no text, no watermark, no people, no hands.'

const ITEMS = [
  ['flat-white.png', 'A flat white coffee in a white ceramic cup on a saucer, smooth microfoam latte art on top'],
  ['cortado.png', 'A cortado coffee served in a small clear glass, equal parts espresso and steamed milk'],
  ['filter-coffee.png', 'A pour-over filter coffee, a V60 dripper dripping into a glass carafe'],
  ['butter-croissant.png', 'A single golden flaky butter croissant on a small marble plate'],
  ['pain-au-chocolat.png', 'A pain au chocolat pastry with dark chocolate inside, flaky golden crust, on a marble plate'],
  ['canele.png', 'A canelé bordelais pastry with a dark caramelised crust on a small ceramic plate'],
  ['coffee-eclair.png', 'A coffee éclair with glossy coffee-coloured glaze on a dark slate plate'],
  ['madeleine.png', 'Three shell-shaped madeleine cakes on a small plate, golden edges'],
  ['iced-coffee.png', 'An iced coffee in a tall glass with ice cubes and a metal straw, condensation'],
  ['cold-brew.png', 'A glass of cold brew coffee over ice, beads of condensation on the glass'],
  ['affogato.png', 'An affogato: a scoop of vanilla gelato in a glass with hot espresso being poured over it'],
  ['house-lemonade.png', 'A tall glass of fresh house lemonade with mint leaves, a lemon slice and ice, sparkling'],
]

async function generate(file, subject) {
  const body = {
    contents: [{ parts: [{ text: subject + STYLE }] }],
    generationConfig: { responseModalities: ['IMAGE'] },
  }
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 300)}`)
  }
  const json = await res.json()
  const parts = json?.candidates?.[0]?.content?.parts || []
  const imgPart = parts.find((p) => p.inlineData?.data)
  if (!imgPart) {
    throw new Error('No image in response: ' + JSON.stringify(json).slice(0, 300))
  }
  fs.writeFileSync(path.join(OUT_DIR, file), Buffer.from(imgPart.inlineData.data, 'base64'))
  console.log(`✓ ${file}`)
}

const run = async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  for (const [file, subject] of ITEMS) {
    try {
      await generate(file, subject)
    } catch (e) {
      console.error(`✗ ${file} — ${e.message}`)
    }
    await new Promise((r) => setTimeout(r, 1500))
  }
  console.log('Done.')
}

run()
