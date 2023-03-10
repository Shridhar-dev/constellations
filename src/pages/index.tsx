import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { createRef, useEffect, useLayoutEffect, useRef, useState } from 'react'


const inter = Inter({ subsets: ['latin'] })

const canvas = createRef()
const outercanvas = createRef()



type coordinates = [number,number][];

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:3000/api/stars`)
  const data:coordinates = await res.json()
  return {
    props: {coordinates:data}, // will be passed to the page component as props
  }
}

/*
function drawCoordinates(arr:coordinates){
  var pointSize = 1; // Change according to the size of the point.

  var ctx = canvas.current.getContext("2d");

  var wsize = outercanvas.current.clientWidth;
  var hsize = outercanvas.current.clientHeight;
  canvas.current.style.width = wsize + "px";
  canvas.current.style.height = hsize + "px";

  // Set actual size in memory (scaled to account for extra pixel density).
  var scale = window.devicePixelRatio; // <--- Change to 1 on retina screens to see blurry canvas.
  canvas.current.width = wsize * scale;
  canvas.current.height = hsize * scale;
 
  // Normalize coordinate system to use css pixels.
  ctx.scale(scale, scale);

  ctx.fillStyle = "white"; // Red color
  ctx.strokeStyle="white";
  
  arr.forEach((coord)=>{
    
    ctx.beginPath();
    ctx.arc(coord[0]-canvas.current.width*1.76+10,coord[1]+170,6,0,2*Math.PI,false);
    //drop canvas and use gates logic to draw lines?
    ctx.stroke();

    ctx.fill()
  })
  
  
  
  // Close the path and fill.
}*/



export default function Home({coordinates}:coordinates) {

  const 
  [dimensions, setDimensions] = useState({ width:0, height: 0 }),
  [scaler,setScaler] = useState(1),
  [lines, setLines] = useState([]);

  useEffect(() => {
    
    //else{
      setDimensions({
        width: outercanvas.current.offsetWidth,
        height: outercanvas.current.offsetHeight
      })
   // }
   console.log(coordinates[2].highY+outercanvas.current.offsetHeight/2 > outercanvas.current.offsetHeight,
   coordinates[2].highX*15+outercanvas.current.offsetWidth/3 > outercanvas.current.offsetWidth)
    if(coordinates[2].highY+outercanvas.current.offsetHeight/2 > outercanvas.current.offsetHeight ||
      coordinates[2].highX*15+outercanvas.current.offsetWidth/3 > outercanvas.current.offsetWidth){
      setScaler(3)
    }
  }, []);

  useEffect(() => {
    
    setLines([])
    coordinates[0].forEach((coord,i)=>{
      let p1 = document.getElementById(coord[0].id);
      let p2 = document.getElementById(coord[1].id);
      
      let a = parseFloat(p1.style.top.slice(0,p1?.style.top.length-2) - p2.style.top.slice(0,p2?.style.top.length-2));
      let b = parseFloat(p1.style.left.slice(0,p1?.style.left.length-2) - p2.style.left.slice(0,p2?.style.left.length-2));

      let y = parseFloat(p1.style.top.slice(0,p1?.style.top.length-2))+4;
      let x = parseFloat(p1.style.left.slice(0,p1?.style.left.length-2))+8



      let c = a*a + b*b + 8;
   
      

      let line = <div id={coord[0].id + "-" + coord[1].id} className={` z-10 line-anim delay-[${i*1000}ms] absolute h-px bg-white origin-left`} style={{width:Math.sqrt(c)+"px",top:y, left:x, rotate:`${(Math.atan(a/b) *180 / Math.PI)+(p2?.style.left < p1?.style.left ? 180 : 0)}deg`}}></div>
      
      setLines((prevState)=>[
        ...prevState,
          line
        ]
      )
    })
  }, [dimensions]);


  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className=' grid grid-flow-col grid-cols-12 bg-black'> 
        <div className=' col-span-3 bg-[#1D1A1A] h-screen'>
        
        </div>
        
        <div className='col-span-9 flex justify-center items-center h-screen'>
     
        <div className={` w-full  bg-black h-full overflow-y-hidden overflow-x-hidden relative`}  ref={outercanvas}>
          
            {
              coordinates[1].map((coord,i)=>{
                //console.log(coord[1])
                return(
                
                 
                  <div key={i} id={coord[2]} className=' h-3 w-3 star transition duration-200 rounded-full border border-white border-1 bg-black  absolute z-20 hover:bg-white  ' style={{top:coord[1]/scaler+dimensions.height/2,left:coord[0]/scaler*15+dimensions.width/3,bottom:"20px"}}>

                  </div>
                )
              })
            }
            {
              lines.map((line)=>{
                return(line)
              })
            }
          
        </div>
       
        </div>
      </main>
    </>
  )
}
