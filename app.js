const puppeteer = require('puppeteer');

const runScraper = async (sub) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })

  let pageArr = []
  let nextPage
  for (i = pageArr.length; i < 3; i++) {
    const page = await browser.newPage()
    nextPage ? await page.goto(nextPage) : await page.goto(`https://old.reddit.com/r/${sub || 'stocks'}/comments/`)
    // Get the "viewport" of the page, as reported by the page.
    const url = await page.$eval('span.nextprev > span.next-button > a', (el) => el)
    nextPage = url.href
    const data = await page.$$eval('div.comment', (divArr) => {
      return divArr.map((comment, index) => {
        const author = comment.querySelector('p.tagline > a.author').innerText;
        const body = comment.querySelector('div.md').innerText;
        const postedAt = comment.querySelector('time.live-timestamp').getAttribute('datetime');
        const timeScraped = new Date().toISOString();
        const fullThread = comment.querySelector('a.bylink').getAttribute('href');
        const scoreHidden = comment.querySelector('span.score-hidden').title;
        const dislikes = comment.querySelector('span.dislikes');
        const likes = comment.querySelector('span.likes');
        const score = comment.querySelector('span.score.unvoted');
        const commentId = comment.getAttribute('data-fullname');
        return { author, body, postedAt, timeScraped, fullThread, scoreHidden, dislikes, likes, score, commentId };
      })
    });

    pageArr.push(data);
    console.log(pageArr)
  }


  await browser.close()
  return pageArr;
};

runScraper()