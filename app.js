const puppeteer = require('puppeteer');

const runScraper = async (sub) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })

  let comments = []
  while (comments.length < 49) {
    const page = await browser.newPage()
    comments.length > 0 ? await page.goto(`https://old.reddit.com/r/${sub || 'stocks'}/comments/?count=${comments.length}&after=${comments?.[comments.length - 1]?.commentId}`) : await page.goto(`https://old.reddit.com/r/${sub || 'stocks'}/comments/`);
    // Get the "viewport" of the page, as reported by the page.
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


    comments.push(data);
    console.log(comments)
  }


  await browser.close()
  return comments;
};

runScraper()