import Head from "next/head";
import { Inter } from "next/font/google";
import { createRef, RefObject, useEffect, useState } from "react";
import getConstellations from "@/utils/getConstellation";
import { coordinates } from "../../types";
import { SearchItem, Star, Tooltip } from "@/components";
import constellationAbbreviations from "../../public/constellationAbbreviations";

const inter = Inter({ subsets: ["latin"] });

const outercanvas: RefObject<HTMLDivElement> = createRef();

export default function Home() {
  const [search, setSearch] = useState<string>(""),
    [info, setInfo] = useState<string>(""),
    [coordinates, setCoordinates] = useState<coordinates>(),
    [dimensions, setDimensions] = useState({ width: 0, height: 0 }),
    [scaler, setScaler] = useState<number>(1),
    [lines, setLines] = useState<{}[]>([]);

  async function setConstellations(name: string) {
    setInfo("Loading...");
    let res = await getConstellations(name);
    const data: coordinates = JSON.parse(res);
    setCoordinates(data);
    let info = await fetch(
      `https://constellations-six.vercel.app/api/info?constellation=${search}`
    );
    let infoJson = await info.json();

    setInfo(infoJson);
  }

  useEffect(() => {
    if (!coordinates) return;
    if (outercanvas.current && coordinates[2]) {
      setDimensions({
        width: outercanvas.current.offsetWidth,
        height: outercanvas.current.offsetHeight,
      });

      if (
        coordinates[2].highY + outercanvas.current.offsetHeight / 2 >
          outercanvas.current.offsetHeight ||
        coordinates[2].highX * 15 + outercanvas.current.offsetWidth / 3 >
          outercanvas.current.offsetWidth
      ) {
        setScaler(3);
      }
    }
  }, [coordinates]);

  useEffect(() => {
    if (!coordinates) return;
    setLines([]);
    coordinates[0].forEach((coord, i) => {
      let p1 = document.getElementById(coord[0].hip);
      let p2 = document.getElementById(coord[1].hip);

      if (p1 && p2) {
        let a = parseFloat(
          (
            parseFloat(p1.style.top.slice(0, p1.style.top.length - 2)) -
            parseFloat(p2.style.top.slice(0, p2.style.top.length - 2))
          ).toString()
        );
        let b = parseFloat(
          (
            parseFloat(p1.style.left.slice(0, p1.style.left.length - 2)) -
            parseFloat(p2.style.left.slice(0, p2.style.left.length - 2))
          ).toString()
        );

        let y = parseFloat(p1.style.top.slice(0, p1?.style.top.length - 2)) + 4;
        let x =
          parseFloat(p1.style.left.slice(0, p1?.style.left.length - 2)) + 8;

        let c = a * a + b * b + 8;

        let line = (
          <div
            key={coord[0].hip + "-" + coord[1].hip}
            id={coord[0].hip + "-" + coord[1].hip}
            className={` line-anim delay-[${
              i * 1000
            }ms] absolute h-px bg-white origin-left`}
            style={{
              width: Math.sqrt(c) + "px",
              top: y,
              left: x,
              rotate: `${
                (Math.atan(a / b) * 180) / Math.PI +
                (p2?.style.left < p1?.style.left ? 180 : 0)
              }deg`,
            }}
          ></div>
        );

        setLines((prevState) => [...prevState, line]);
      }
    });
  }, [dimensions, coordinates]);

  return (
    <>
      <Head>
        <title>Constellations</title>
        <meta name="description" content="A simple constellation plotter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" grid grid-flow-col grid-cols-12 bg-black">
        <div className="col-span-4 bg-[#1D1A1A] p-5 h-screen flex flex-col justify-start items-center overflow-y-auto">
          <input
            className="bg-black text-white border-white border py-2 px-3 w-full"
            placeholder="Search"
            autoComplete="false"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />

          {search.length > 0 &&
            Object.keys(constellationAbbreviations)
              .filter((element) =>
                element.toLowerCase().includes(search.toLowerCase())
              )
              .map((val, i) => (
                <SearchItem
                  key={i}
                  name={val}
                  abbr={constellationAbbreviations[val]}
                  setConstellations={setConstellations}
                  setSearch={setSearch}
                />
              ))}
          <div className=" text-white mt-5">{info}</div>
        </div>
        <div className="col-span-8 flex justify-center items-center h-screen">
          <div
            className={` w-full flex justify-center items-center  bg-black h-full overflow-y-hidden overflow-x-hidden relative`}
            ref={outercanvas}
          >
            <>
              {lines.map((line) => {
                return line;
              })}
              {coordinates
                ? coordinates[1].map((coord, i) => {
                    return (
                      <Star
                        key={i}
                        id={coord[2].toString()}
                        top={coord[1]}
                        left={coord[0]}
                        scaler={scaler}
                        name={coord[3]}
                        dimensions={dimensions}
                      />
                    );
                  })
                : null}
            </>
          </div>
        </div>
      </main>
    </>
  );
}
