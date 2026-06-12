import puppeteer from 'puppeteer-core'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new',
  args: ['--autoplay-policy=no-user-gesture-required','--no-sandbox','--mute-audio'] })
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
let stream = 0
page.on('request', r => { if (r.url().includes('googlevideo.com')) stream++ })
await page.goto('http://localhost:4173', { waitUntil: 'networkidle2' })
await sleep(4000)
const pressedOnLoad = await page.$eval('button[aria-label="Activar música"],button[aria-label="Pausar música"]', el => el.getAttribute('aria-pressed'))
// Simular primer gesto: un scroll
await page.evaluate(() => window.scrollBy(0, 200))
await sleep(4000)
const pressedAfterGesture = await page.$eval('button[aria-label="Activar música"],button[aria-label="Pausar música"]', el => el.getAttribute('aria-pressed'))
console.log('música aria-pressed al cargar:', pressedOnLoad)
console.log('música aria-pressed tras 1er gesto (scroll):', pressedAfterGesture)
console.log('stream googlevideo:', stream, stream>0?'=> SUENA ✓':'(sin stream)')
// Ir al dress code y leer las muestras de color + etiquetas
const dcTop = await page.evaluate(() => {
  const a = [...document.querySelectorAll('article')].find(a => a.textContent.includes('Código de vestimenta'))
  return a ? a.getBoundingClientRect().top + window.scrollY - 40 : 0
})
await page.evaluate(y => window.scrollTo({top:y,behavior:'instant'}), dcTop)
await sleep(1200)
const swatches = await page.evaluate(() => {
  const a = [...document.querySelectorAll('article')].find(a => a.textContent.includes('Código de vestimenta'))
  return [...a.querySelectorAll('span[style*=background]')].map(s => ({
    bg: s.style.backgroundColor,
    label: s.parentElement.querySelector('span:last-child')?.textContent
  }))
})
console.log('muestras dress code:', JSON.stringify(swatches))
await page.screenshot({ path: '/tmp/kd-mobile/v-dresscode.png' })
await browser.close()
console.log('VERIFY DONE')
