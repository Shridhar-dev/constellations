// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = Array<Array<{id:number,ra:number,de:number}>>


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  fs.readFile('./public/constellations', 'utf8', async (err:any, data:any) => {
    if (err) {
      console.error(err);
      return;
    }

    let i;
    
    for(i=0; i < data.length; i++){
      if(`${data[i]}${data[i+1]}${data[i+2]}` == "Ori"){
        i=i+8;
        break;
      }
    }
    let a = [];
    let b = [];
    let c=0;
    let temp;
    for(i=i; data[i] != 'a' && data[i] !== undefined ; i++){
      if(data[i] !== ' '){
        b.push(data[i])
      }
      else{
        temp = b.join('');
        a.push(b.join(''))
        b=[];
      }
      
    }
    let obj:Array<Array<{id:number,ra:number,de:number}>>=[];
    let t = [];
    let  count = 0;
    for(let i=0; i < a.length; i=i+1){
      let data = await fetch(`https://www.astropical.space/api.php?table=stars&which=hip&limit=${a[i]}&format=json`);
      let json = await data.json();
      
      console.log(t)

      if(count === 2){
        //obj.push(t)
        let copyOfMyArray = t.slice();
        obj.push(copyOfMyArray)
        t.shift();
        count=1
      }
      
      else{
        t.push({id:json.hipstars[0].hip,ra:json.hipstars[0].ra,de:json.hipstars[0].de})
        count++;
      }

      if(i === a.length - 1){
        console.log(obj)
      }
    }


    
    res.status(200).json(obj)

  });
  
}
