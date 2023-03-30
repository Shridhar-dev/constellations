import constellations from "../../public/constellations";
import { star, stars } from "../../types";

export default async function useConstellation(name: string) {
  let obj: { [key: string]: star } = {};
  let obj2 = [];
  let lowX = 100000000;
  let lowY = 100000000;
  let highY = 0;
  let highX = 0;

  let cons: string = name;

  let objectData = await fetch(
    `https://www.astropical.space/api.php?table=stars&which=constellation&limit=${cons}&format=json`
  );
  let objectJson = await objectData.json();

  for (let i = 0; i < constellations[cons].length; i = i + 1) {
    let t = [];
    for (let j = 0; j < constellations[cons][i].length; j++) {
      if (constellations[cons][i][j + 1]) {
        let json1: star = objectJson.hipstars.find(
          (x: star) => x.hip === constellations[cons][i][j]
        );
        let json2: star = objectJson.hipstars.find(
          (x: star) => x.hip === constellations[cons][i][j + 1]
        );

        if (!json1 || !json2) {
          continue;
        }
        lowX =
          json1.ra < json2.ra && json1.ra < lowX
            ? json1.ra
            : json2.ra < json1.ra && json2.ra < lowX
            ? json2.ra
            : lowX;

        lowY =
          json1.de < json2.de && json1.de < lowY
            ? json1.de
            : json2.de < json1.de && json2.de < lowY
            ? json2.de
            : lowY;

        highY =
          json1.de > json2.de && json1.de > highY
            ? json1.de
            : json2.de > json1.de && json2.de > highY
            ? json2.de
            : highY;

        highX =
          json1.ra > json2.ra && json1.ra > highX
            ? json1.ra
            : json2.ra > json1.ra && json2.ra > highX
            ? json2.ra
            : highX;

        obj[json1.hip] = { hip: json1.hip, ra: json1.ra, de: json1.de };
        obj[json2.hip] = { hip: json2.hip, ra: json2.ra, de: json2.de };

        obj2.push([
          { hip: json1.hip, ra: json1.ra, de: json1.de },
          { hip: json2.hip, ra: json2.ra, de: json2.de },
        ]);
      }
    }
  }

  let stars: stars = [];

  Object.values(obj).forEach((star: star) => {
    stars.push([
      (star.ra - lowX) * 15,
      (star.de - lowY) * 20 - (highY - lowY) * 10,
      star.hip,
    ]);
  });

  return JSON.stringify([
    obj2,
    stars,
    {
      highX: (highX - lowX) * 15,
      highY: (highY - lowY) * 20 - (highY - lowY) * 10,
    },
  ]);
}
