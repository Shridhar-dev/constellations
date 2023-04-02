// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {

  (async () => {
   
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.62");
    await page.goto(`https://www.astropical.space/constel.php?sel=&nam=${req.query.constellation}`);
    await page.click('tbody#dbtable>tr> td:nth-child(13) >a')
    await page.waitForSelector('#modaltext')
    let element = await page.$('#modaltext')
    let value = await page.evaluate((el:Element | null) => el?.textContent, element)
    res.status(200).json(value || '')
    await browser.close();
  })();
    
}
