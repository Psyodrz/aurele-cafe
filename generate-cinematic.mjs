import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, 'public', 'images', 'cinematic')

// Read the API key from the MCP config (avoids hardcoding the secret here)
const mcp = JSON.parse(fs.readFileSync(path.join(__dirname, '.kiro', 'settings', 'mcp.json'), 'utf8'))
const API_KEY = mcp.mcpServers.gemini.env.GEMINI_API_KEY
const MODEL = 'gemini-2.5-flash-image'
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`

const STYLE =
  ' — ultra-premium 16:9 widescreen cinematic photograph, photorealistic, ' +
  'dramatic moody lighting, warm golden accents over deep charcoal tones, ' +
  'shallow depth of field, fine film grain, elegant minimal luxury aesthetic, ' +
  'high detail, no text, no watermark.'

const ITEMS = [
  ['cinematic-reveal.png', 'A breathtaking cinematic reveal of a premium luxury cinema interior, sweeping wide shot'],
  ['cafe-day-night.png', 'A modern cafe interior architecture transitioning from warm day light to moody night lighting'],
  ['coffee-roasting.png', 'High-speed macro photography of coffee beans tumbling into a glowing roasting chamber'],
  ['coffee-transform.png', 'Magical realism, coffee beans beautifully transforming into delicate small sculptures'],
  ['premium-cinema.png', 'An ultra-premium luxury cinema seating area with dramatic cinematic lighting'],
  ['premium-luxury.png', 'Architectural visualization of a pure ultra-premium luxury space, sculptural minimalism'],
  ['liquid-gourmet.png', 'Liquids dynamically assembling into a gourmet beverage mid-air, slow-motion splash aesthetic'],
  ['dessert-reveal.png', 'A luxury gourmet dessert beautifully assembling itself, levitating layers, slow-motion'],
  ['morning-coffee.png', 'Morning sunlight over a serene mountain landscape with a steaming cup of fresh coffee in foreground'],
  ['cafe-interior.png', 'A high-end modern cafe interior with aesthetic designer seating and warm ambient glow'],
  ['liquid-gold.png', 'Abstract dark premium cinematic aesthetic with flowing liquid gold elements'],
  ['coffee-brewing.png', 'Cinematic extreme close-up of a luxury pour-over coffee brewing process, steam and golden drips'],
]

async function generate(file, subject) {
  const body = {
    contents: [{ parts: [{ text: subject + STYLE }] }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: { aspectRatio: '16:9' },
    },
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
  console.log(`\u2713 ${file}`)
}

const run = async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  for (const [file, subject] of ITEMS) {
    try {
      await generate(file, subject)
    } catch (e) {
      console.error(`\u2717 ${file} \u2014 ${e.message}`)
    }
    await new Promise((r) => setTimeout(r, 1500))
  }
  console.log('Done.')
}

run()
