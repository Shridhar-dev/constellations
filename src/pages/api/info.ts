import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {

  (async () => {
   
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    await page.goto(`https://www.astropical.space/constel.php?sel=&nam=${req.query.constellation}`);
    await page.click('tbody#dbtable>tr> td:nth-child(13) >a')
    await page.waitForSelector('#modaltext')
    let element = await page.$('#modaltext')
    let value = await page.evaluate((el:Element | null) => el?.textContent, element)
    res.status(200).json(value || '')
    await browser.close();
  })();
    
}
