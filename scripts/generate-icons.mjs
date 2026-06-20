import sharp from 'sharp'
import { mkdirSync } from 'fs'

const SOURCE = 'public/icons/source.png'
mkdirSync('public/icons', { recursive: true })

const iconSizes = [
  { size: 72, name: 'icon-72.png' },
  { size: 96, name: 'icon-96.png' },
  { size: 128, name: 'icon-128.png' },
  { size: 144, name: 'icon-144.png' },
  { size: 152, name: 'icon-152.png' },
  { size: 192, name: 'icon-192.png', purpose: 'any' },
  { size: 384, name: 'icon-384.png' },
  { size: 512, name: 'icon-512.png', purpose: 'any' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 167, name: 'apple-touch-icon-167.png' },
  { size: 152, name: 'apple-touch-icon-152.png' },
  { size: 32, name: 'favicon-32.png' },
  { size: 16, name: 'favicon-16.png' },
]

async function main() {
  for (const icon of iconSizes) {
    await sharp(SOURCE).resize(icon.size, icon.size).png().toFile(`public/icons/${icon.name}`)
    console.log(`✓ Generated ${icon.name}`)
  }
  console.log('All icons generated!')
}

main().catch(console.error)
