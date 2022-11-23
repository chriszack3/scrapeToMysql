const puppeteer = require('puppeteer');

const runScraper = async (sub) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.goto(`https://old.reddit.com/r/${sub || 'stocks'}/comments/`);

  // Get the "viewport" of the page, as reported by the page.
  const data = await page.$$eval('div.comment', divArr => {
    const divs = divArr.map(div => {
        const author = div.querySelector('p.tagline > a.author').innerText;
        const body = div.querySelector('div.md').innerText;
        const time = div.querySelector('time.live-timestamp').getAttribute('datetime');
        const fullThread = div.querySelector('a.bylink').getAttribute('href');
        const scoreHidden = div.querySelector('span.score-hidden').title;
        const dislikes = div.querySelector('span.dislikes');
        const likes = div.querySelector('span.likes');
        const score = div.querySelector('span.score.unvoted');
        const commentId = div.getAttribute('data-fullname');

        return { author, body, time, fullThread, scoreHidden, dislikes, likes, score, commentId };
    })
    return divs;
  })
  await browser.close()
  return data
};

runScraper().then(data => console.log(data));