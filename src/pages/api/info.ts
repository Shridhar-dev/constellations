// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer';

function isUpperCase(str:string) {
  return str === str.toUpperCase();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {

  //let formattedString = req.query.constellation.replace(/[A-Z&]/g, (m,i) => isUpperCase(m) && i!==0  ? "%20"+m.toLowerCase() : m.toLowerCase());
  
  /*
  let formattedString=[];

  for(let i=req.query.constellation.length; i>0; i--){
    if(isUpperCase(req.query.constellation[i-1])){
      formattedString[i] = '%20'
      continue;
    }
    formattedString[i] = req.query.constellation[i-1]
  }

  console.log(formattedString)
*/
  (async () => {
   
    const browser = await puppeteer.launch();
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
