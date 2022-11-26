const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const runScraper = async (sub) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })

  let pageArr = []
  let nextPage
  for (i = pageArr.length; i < 3; i++) {
    const page = await browser.newPage()
    nextPage ? await page.goto(nextPage) : await page.goto(`https://old.reddit.com/r/${sub || 'stocks'}/comments/`)
    const data = await page.content()
    pageArr.push(data)
    // Get the "viewport" of the page, as reported by the page.
    const url = await page.$eval('span.nextprev > span.next-button > a', (el) => el)
    nextPage = url.href
  }

  await browser.close()
  return pageArr;
};

const parseData = (pages) => {
  const getComments = (pageRoot) => {
    const $ = cheerio.load(pageRoot, null, false)
    const commentArr = $('div.comment').html()
    return commentArr
  }
  const comments = pages.map(page => getComments(page))
  return comments
}

const app = async () => {
  const pageArr = await runScraper()
  const comments = parseData(pageArr)
  console.log(comments)
}

app()