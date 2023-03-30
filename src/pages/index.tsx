import Head from "next/head";
import { Inter } from "next/font/google";
import { createRef, RefObject, useEffect, useState } from "react";
import useConstellations from "@/hooks/useConstellation";
import { coordinates } from "../../types";
import SearchItem from "@/components/SearchItem";
import constellationAbbreviations from "../../public/constellationAbbreviations";

const inter = Inter({ subsets: ["latin"] });

const outercanvas: RefObject<HTMLDivElement> = createRef();

export default function Home() {
  const [search, setSearch] = useState<string>(""),
    [coordinates, setCoordinates] = useState<coordinates>(),
    [dimensions, setDimensions] = useState({ width: 0, height: 0 }),
    [scaler, setScaler] = useState<number>(1),
    [lines, setLines] = useState<{}[]>([]);

  async function setConstellations(name: string) {
    let res = await useConstellations(name);
    const data: coordinates = JSON.parse(res);
    setCoordinates(data);
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
            id={coord[0].hip + "-" + coord[1].hip}
            className={` z-10 line-anim delay-[${
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
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" grid grid-flow-col grid-cols-12 bg-black">
        <div className="col-span-4 bg-[#1D1A1A] p-5 h-screen flex flex-col justify-start items-center overflow-y-auto">
          <input
            className="bg-black text-white border-white border py-2 px-3 w-full"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />

          {search.length > 0 &&
            Object.keys(constellationAbbreviations)
              .filter((element) => element.includes(search))
              .map((val, i) => (
                <SearchItem
                  key={i}
                  name={val}
                  abbr={constellationAbbreviations[val]}
                  setConstellations={setConstellations}
                />
              ))}
        </div>
        <div className="col-span-8 flex justify-center items-center h-screen">
          <div
            className={` w-full flex justify-center items-center  bg-black h-full overflow-y-hidden overflow-x-hidden relative`}
            ref={outercanvas}
          >
            <>
              {coordinates
                ? coordinates[1].map((coord, i) => {
                    return (
                      <div
                        key={i}
                        id={coord[2].toString()}
                        className="h-3 w-3 star transition duration-200 rounded-full border border-white border-1 bg-black  absolute z-20 hover:bg-white"
                        style={{
                          top: coord[1] / scaler + dimensions.height / 2,
                          left: (coord[0] / scaler) * 15 + dimensions.width / 3,
                          bottom: "20px",
                        }}
                      ></div>
                    );
                  })
                : null}

              {lines.map((line) => {
                return line;
              })}
            </>
          </div>
        </div>
      </main>
    </>
  );
}
