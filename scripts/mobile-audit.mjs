import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:4173'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })

async function audit(width, height, tag, fullTour) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await page.goto(URL, { waitUntil: 'networkidle2' })
  await sleep(3000)

  const overflow = await page.evaluate(() => {
    const w = document.scrollingElement.scrollWidth
    return { scrollWidth: w, innerWidth: window.innerWidth, overflow: w > window.innerWidth }
  })
  console.log(`[${tag}] overflow horizontal:`, JSON.stringify(overflow))

  await page.screenshot({ path: `/tmp/kd-mobile/${tag}-00-hero.png` })

  if (fullTour) {
    const tops = await page.evaluate(() =>
      [...document.querySelectorAll('main > section, footer')].map((s) => ({
        top: Math.max(0, s.getBoundingClientRect().top + window.scrollY - 60),
        id: s.id || s.tagName.toLowerCase(),
      }))
    )
    let n = 1
    for (const { top, id } of tops) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top)
      await sleep(1400)
      await page.screenshot({ path: `/tmp/kd-mobile/${tag}-${String(n).padStart(2, '0')}-${id}.png` })
      n++
    }
  }
  await page.close()
}

await audit(390, 844, 'i14', true)
await audit(360, 800, 'a360', false)
await browser.close()
console.log('AUDIT DONE')
