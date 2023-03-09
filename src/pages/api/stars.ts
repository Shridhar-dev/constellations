// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import constellations from '../../../public/constellations'

import type { NextApiRequest, NextApiResponse } from 'next'

type Data = Array<Array<{id:number,ra:number,de:number}>|{highX:number,highY:number}>



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    
    let obj = {}
    let obj2 = [];
    let count = 0;
    let lowX = 100000000;
    let lowY = 100000000;
    let highY = 0;
    let highX = 0;
    let prev = null;

    let cons:string = 'Ori';

    for(let i=0; i < constellations[cons].length; i=i+1){
      let t = [];
      for(let j=0; j < constellations[cons][i].length; j++){
        
        if(constellations[cons][i][j+1]){

          let data1 = await fetch(`https://www.astropical.space/api.php?table=stars&which=hip&limit=${constellations[cons][i][j]}&format=json`);
          let json1 = await data1.json();

          let data2 = await fetch(`https://www.astropical.space/api.php?table=stars&which=hip&limit=${constellations[cons][i][j+1]}&format=json`);
       
          let json2 = await data2.json();

          
          if(!json1.hipstars[0] || !json2.hipstars[0]){
            continue;
          }
          lowX =
          json1.hipstars[0].ra < json2.hipstars[0].ra && json1.hipstars[0].ra < lowX ? json1.hipstars[0].ra : 
          json2.hipstars[0].ra < json1.hipstars[0].ra && json2.hipstars[0].ra < lowX ? json2.hipstars[0].ra : 
          lowX;

          lowY =
          json1.hipstars[0].de < json2.hipstars[0].de && json1.hipstars[0].de < lowY ? json1.hipstars[0].de : 
          json2.hipstars[0].de < json1.hipstars[0].de && json2.hipstars[0].de < lowY ? json2.hipstars[0].de : 
          lowY;
          
          highY =
          json1.hipstars[0].de > json2.hipstars[0].de && json1.hipstars[0].de > highY ? json1.hipstars[0].de : 
          json2.hipstars[0].de > json1.hipstars[0].de && json2.hipstars[0].de > highY ? json2.hipstars[0].de : 
          highY;

          
          highX =
          json1.hipstars[0].ra > json2.hipstars[0].ra && json1.hipstars[0].ra > highX ? json1.hipstars[0].ra : 
          json2.hipstars[0].ra > json1.hipstars[0].ra && json2.hipstars[0].ra > highX ? json2.hipstars[0].ra : 
          highX;

          obj[json1.hipstars[0].hip]={id:json1.hipstars[0].hip,ra:json1.hipstars[0].ra,de:json1.hipstars[0].de}
          obj[json2.hipstars[0].hip]={id:json2.hipstars[0].hip,ra:json2.hipstars[0].ra,de:json2.hipstars[0].de}

          obj2.push([
            {id:json1.hipstars[0].hip,ra:json1.hipstars[0].ra,de:json1.hipstars[0].de},
            {id:json2.hipstars[0].hip,ra:json2.hipstars[0].ra,de:json2.hipstars[0].de}
          ])
        }
        /*if(count === 2){
          
          let copyOfMyArray = t.slice();
        obj2.push(copyOfMyArray)
        t.shift();
        count=1
        }
        else{
          t.push(constellations['Ori'][i][j])
          count++;
        }*/
      }
      
    
      
      /*let data1 = await fetch(`https://www.astropical.space/api.php?table=stars&which=hip&limit=${a[i]}&format=json`);
      let json1 = await data1.json();

      let data2 = await fetch(`https://www.astropical.space/api.php?table=stars&which=hip&limit=${a[i+1]}&format=json`);
      let json2 = await data2.json();

      lowX =
      json1.hipstars[0].ra < json2.hipstars[0].ra && json1.hipstars[0].ra < lowX ? json1.hipstars[0].ra : 
      json2.hipstars[0].ra < json1.hipstars[0].ra && json2.hipstars[0].ra < lowX ? json2.hipstars[0].ra : 
      lowX;

      if(json1.hipstars[0].ra < json2.hipstars[0].ra){
        if(json1.hipstars[0].ra < lowX){
          lowX = json1.hipstars[0].ra
        }
      }
      else if(json2.hipstars[0].ra < json1.hipstars[0].ra){
        if(json2.hipstars[0].ra < lowX){
          lowX = json2.hipstars[0].ra
        }
      }
      else{
        lowX=lowX
      }

      lowY =
      json1.hipstars[0].de < json2.hipstars[0].de && json1.hipstars[0].de < lowY ? json1.hipstars[0].de : 
      json2.hipstars[0].de < json1.hipstars[0].de && json2.hipstars[0].de < lowY ? json2.hipstars[0].de : 
      lowY;

      //console.log(json1.hipstars[0].de, json2.hipstars[0].de, json1.hipstars[0].de < json2.hipstars[0].de ,json1.hipstars[0].de < lowY ,lowY)
      highY =
      json1.hipstars[0].de > json2.hipstars[0].de && json1.hipstars[0].de > highY ? json1.hipstars[0].de : 
      json2.hipstars[0].de > json1.hipstars[0].de && json2.hipstars[0].de > highY ? json2.hipstars[0].de : 
      highY;

      

      
     
      
      obj[json1.hipstars[0].hip]={id:json1.hipstars[0].hip,ra:json1.hipstars[0].ra,de:json1.hipstars[0].de}
      obj[json2.hipstars[0].hip]={id:json2.hipstars[0].hip,ra:json2.hipstars[0].ra,de:json2.hipstars[0].de}
     
      
      obj2.push([
        {id:json1.hipstars[0].hip,ra:json1.hipstars[0].ra,de:json1.hipstars[0].de},
        {id:json2.hipstars[0].hip,ra:json2.hipstars[0].ra,de:json2.hipstars[0].de}
      ])*/
    
    }
   
    let stars = [];

    Object.values(obj).forEach((star)=>{
        
        stars.push([(star.ra-lowX)*15, ((star.de)-lowY)*20-((highY-lowY)*10), star.id]);
    })

    res.status(200).json([obj2,stars,{highX:(highX-lowX)*15,highY:(highY-lowY)*20-((highY-lowY)*10)}])

  
  
}
