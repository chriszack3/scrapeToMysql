const puppeteer = require('puppeteer');

const runScraper = async (sub) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.goto(`https://old.reddit.com/r/${sub || 'stocks'}/comments/`);

  // Get the "viewport" of the page, as reported by the page.
  const divs = await page.$$eval('div.md', divs => {
    const innerText = divs?.map((div, index) => {
      return div.innerText || null
    })
    return innerText
  })
  await browser.close()
  return divs
};

runScraper().then(data => console.log(data))